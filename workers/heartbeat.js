const CronJob = require('cron').CronJob
const redis = require("redis");
const Redlock = require('redlock');
const {Publisher, Subscriber} = require("../common/pubsub");

const REDIS_HOST = process.env.REDIS_HOST;
const SECONDS_TO_MS = 1000;
const HEARTBEAT_LOCK_KEY = 'locks:heartbeat';
const HEARTBEAT_SUBSCRIBERS_KEY = 'heartbeat:subscribers';
const HEARTBEAT_SECONDS = 10;

const redisClient = redis.createClient({host: REDIS_HOST});

const subscriberNotifications = new Subscriber('pubsub:heartbeat');
const heartbeatClientLock = new Redlock(
    [redisClient], {
    driftFactor: 0.01,
    retryCount:  10,
    retryDelay:  0.2 * SECONDS_TO_MS,
    retryJitter:  0.2 * SECONDS_TO_MS
});

subscriberNotifications.addHandler(message => {
    const jsonMsg = JSON.parse(message);
    const session = jsonMsg.session;
    if (jsonMsg.run){
        redisClient.zadd(HEARTBEAT_SUBSCRIBERS_KEY, Date.now(), session);
    }
    else{
        redisClient.zrem(HEARTBEAT_SUBSCRIBERS_KEY, session);
    }
});

new CronJob(`*/${HEARTBEAT_SECONDS} * * * * *`, () => {
    heartbeatClientLock.lock(HEARTBEAT_LOCK_KEY, 1 * SECONDS_TO_MS)
    .then((lock) => {
        const tenSecondsAgo = Date.now() - 10*SECONDS_TO_MS;
        redisClient.zrangebyscore(HEARTBEAT_SUBSCRIBERS_KEY, 0, tenSecondsAgo, (_err, sessionsNeedingPing) => {
            sessionsNeedingPing.forEach(sessionId => {
                const publisher = new Publisher(`pubsub:${sessionId}`);
                publisher.publish('beep');
                publisher.close();
                redisClient.zadd(HEARTBEAT_SUBSCRIBERS_KEY, Date.now(), sessionId);
            });
        })
        return lock.unlock();
    })    
    .catch(err => console.error(err));

}, null, true);
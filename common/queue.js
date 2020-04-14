const redis = require("redis");

const REDIS_HOST = process.env.REDIS_HOST;

module.exports = {
    Publisher: class Publisher {
        constructor(channel) {
            this._publisher = redis.createClient({host: REDIS_HOST});
            this._channel = channel;
        }

        publish(message) {
            this._publisher.publish(this._channel, message);
        }

        close(){
            this._publisher.quit();
        }
    },

    Subscriber: class Subscriber {
        constructor(channel) {
            this._subscriber = redis.createClient({host: REDIS_HOST});
            this._subscriber.subscribe(channel);
            this._messageHandlers = [];
            
            this._subscriber.on("message", (channel, message) => {
                this._messageHandlers.forEach(messageHandler => messageHandler(message))
            });
        }

        close(){
            this._subscriber.quit();
            this._messageHandlers = [];
        }

        addHandler(messageHandler){
            this._messageHandlers.push(messageHandler);
        }

        removeHandler(messageHandler){
            this._messageHandlers.filter(existingHandler => existingHandler != messageHandler);
        }
    }
};
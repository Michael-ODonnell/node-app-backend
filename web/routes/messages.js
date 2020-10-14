const express = require("express");
const {Publisher} = require("../../common/pubsub");
const session = require('../../common/session');

const messageRoute = express.Router();

const heartbeatPublisher = new Publisher('pubsub:heartbeat');

messageRoute.get('/', function (req, res) {
    res.send('Messages home page');
});

messageRoute.post('/echo', 
    session.checkToken(),
    function (req, res) {
        const session = req.token;
        const message = req.body.message;
        const messagePublisher = new Publisher(`pubsub:${session.session_id}`);
        res.send(`Sending echo to ${session.username}`);
        messagePublisher.publish(message);
        messagePublisher.close();
});

messageRoute.post('/heartbeat/start', 
    session.checkToken(),
    function (req, res) {
        const session = req.token;
        heartbeatPublisher.publish(JSON.stringify({session: session.session_id, run:true}));
        res.send(`starting heartbeat for ${session.username}`);
});

messageRoute.post('/heartbeat/stop', 
    session.checkToken(),
    function (req, res) {
        const session = req.token;
        heartbeatPublisher.publish(JSON.stringify({session: session.session_id, run:false}));
        res.send(`stopping heartbeat for ${session.username}`);
});

module.exports = messageRoute;

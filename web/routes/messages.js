const express = require("express");
const {Publisher} = require("../../common/queue");

const messageRoute = express.Router();
const messagePublisher = new Publisher('messages');

messageRoute.get('/', function (req, res) {
    res.send('Messages home page');
});

messageRoute.post('/publish', function (req, res) {
    const message = req.body.message;
    messagePublisher.publish(message);
    res.send(`Sent: ${message}`);
});

module.exports = messageRoute;

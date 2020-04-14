const {Subscriber} = require("../common/queue");

const messageSubscriber = new Subscriber('messages');

messageSubscriber.addHandler(message => console.log(`Received: ${message}`));
const express = require("express");
const usersRoute = express.Router();

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

// define the home page route
usersRoute.get('/:uid', function (req, res) {
    const uid = req.params.uid;
    res.send(`User ${uid}`);
});

module.exports = usersRoute;

const express = require("express");
const usersRoute = express.Router();

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

module.exports = usersRoute;

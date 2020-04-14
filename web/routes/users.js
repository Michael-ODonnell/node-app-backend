const express = require("express");
const userQueries = require('../db/users');
const db = require('../../common/sqlDatabaseConnection');

const usersRoute = express.Router();

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

// define the home page route
usersRoute.get('/:id', function (req, res) {
    const id = req.params.id;
    db.executeQuery(userQueries.getUserName, [`${id}`])
    .then(dbResponse => {
        const username = dbResponse[0].username;
        res.send(username);
    });
});

usersRoute.post('/create', function (req, res) {
    const username = req.body.username;
    db.executeQuery(userQueries.insert, [`${username}`])
    .then(dbResponse => {
        const id = dbResponse[0].id;
        res.send(id);
    });
});

module.exports = usersRoute;

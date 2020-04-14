const express = require("express");
const { Pool } = require('pg');
const userQueries = require('../db/users');

const usersRoute = express.Router();

const pool = new Pool()

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

// define the home page route
usersRoute.get('/:id', function (req, res) {
    const id = req.params.id;
    pool.query(userQueries.getUserName, [`${id}`])
    .then(dbResponse => {
        const username = dbResponse.rows[0].username;
        res.send(username);
    });
});

usersRoute.post('/create', function (req, res) {
    const username = req.body.username;
    pool.query(userQueries.insert, [`${username}`])
    .then(dbResponse => {
        const id = dbResponse.rows[0].id;
        res.send(id);
    });
});

module.exports = usersRoute;

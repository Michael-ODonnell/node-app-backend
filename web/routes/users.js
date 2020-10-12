const express = require("express");
const userQueries = require('../db/users');
const db = require('../../common/sqlDatabaseConnection');

const bcrypt = require('bcrypt');

const usersRoute = express.Router();
const saltRounds = 10;

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

// define the home page route
usersRoute.post('/:username', function (req, res) {
    const requestedUser = req.params.username;
    const email = req.body.email;
    const plaintextPassword = req.body.password;

    db.executeQuery(userQueries.getAuthDetails, [`${email}`])
    .then(dbResponse => {
        const authenticatedUser = dbResponse[0];
        if(!authenticatedUser){
            res.status(403).send('not authenticated');
            return;
        }

        bcrypt.compare(plaintextPassword, authenticatedUser.hash)
        .then(result => {
            if(result && authenticatedUser.username === requestedUser) {
                res.send('authenticated');
            }
            else if(result) {
                res.status(403).send('wrong user');
            }
            else {
                res.status(403).send('not authenticated');
            }

        })
    });
});

usersRoute.post('/create', function (req, res) {
    const email = req.body.email;
    const plaintextPassword = req.body.password;
    const username = req.body.username;
    bcrypt.hash(plaintextPassword, saltRounds)
    .then(hash => {
        return db.executeQuery(userQueries.insert, [`${email}`, `${hash}`, `${username}`]);
    })
    .then(dbResponse => {
        const email = dbResponse[0].email;
        res.send(email);
    })
    .catch(err => {
        console.error(JSON.stringify(err))
    });
});

module.exports = usersRoute;

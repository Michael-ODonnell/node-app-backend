const express = require("express");

const db = require('../../common/sqlDatabaseConnection');
const userQueries = require('../db/users');
const session = require('../../common/session');

const usersRoute = express.Router();
const saltRounds = 10;
const DAYS_IN_SECONDS = 24*60*60;
const MINUTES_IN_SECONDS = 60;

// define the home page route
usersRoute.get('/', function (req, res) {
    res.send('Users home page');
});

// authenticate a user and return a session token
usersRoute.post('/login', function (req, res) {
    const email = req.body.email;
    const plaintextPassword = req.body.password;
    const getDevToken = process.env.NODE_ENV === 'development' && req.body.dev_token === true;
    const ttl = getDevToken ? 180*DAYS_IN_SECONDS : 5*MINUTES_IN_SECONDS;

    db.executeQuery(userQueries.getAuthDetails, [`${email}`])
    .then(dbResponse => {
        const user = dbResponse[0];
        if(!user){
            return Promise.reject({status: 403, error: 'Invalid login details'})
        }

        return session.create(user, plaintextPassword, ttl);
    })
    .then(response => {
        res.json(response);
    })
    .catch(error => {
        res.status(error.status).send(error.message);
    });
});

usersRoute.post('/refresh', 
    session.checkToken(),
    function (req, res) {
        const getDevToken = process.env.NODE_ENV === 'development' && req.body.dev_token === true;
        const ttl = getDevToken ? 180*DAYS_IN_SECONDS : 5*MINUTES_IN_SECONDS;
        session.refresh(req.token, ttl)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(err.status).send(err.message);
        });
    }
);

usersRoute.post('/validate', 
    session.checkToken(),
    function (req, res) {
        res.json({isValid: true})
    }
);

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


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid')

const PRIVATE_SESSION_KEY = process.env.PRIVATE_SESSION_KEY;
const PUBLIC_SESSION_KEY = process.env.PUBLIC_SESSION_KEY;
const SESSION_KEY_ALGORITHM = process.env.SESSION_KEY_ALGORITHM;
const SESSION_TTL = 60

class Session {

    create(user, password){
        return bcrypt.compare(password, user.hash)
        .then(result => {
            return new Promise((resolve, reject)=>{
                if(result) {
                    jwt.sign({
                        username: user.username,
                        email: user.email,
                        session_id: uuid.v4(),
                    }, PRIVATE_SESSION_KEY, {
                        expiresIn: SESSION_TTL,
                        algorithm: SESSION_KEY_ALGORITHM
                    }, (error, token) => {
                        if(error) {
                            reject({status: 403, error});
                        }
                        else{
                            resolve({token, session_ttl: SESSION_TTL});
                        }
                    })
                }
                else {
                    reject({status: 403, error: 'Invalid login details'});
                }
            })
        });
    }

    refresh(token){
        return new Promise((resolve, reject)=>{
            jwt.sign({
                username: token.username,
                email: token.email,
                session_id: token.session_id,
            }, PRIVATE_SESSION_KEY, {
                expiresIn: SESSION_TTL,
                algorithm: SESSION_KEY_ALGORITHM
            }, (error, token) => {
                if(error) {
                    reject({status: 403, error});
                }
                else{
                    resolve({token, session_ttl: SESSION_TTL});
                }
            });
        });
    }

    checkToken(){
        const tokenKey='token';
        return (req, res, next) => {
            jwt.verify(req.body[tokenKey], PUBLIC_SESSION_KEY, (err, decoded)=>{
                if (err) {
                    switch (err.name) {
                        case 'TokenExpiredError': {
                            res.statusCode = 400
                            res.json({
                                error: {
                                    field: tokenKey,
                                    code: 'TOKEN_EXPIRED'
                                }
                            });
                            break
                        }
                        default: {
                            res.statusCode = 400
                            res.json({
                                error: {
                                    field: tokenKey,
                                    code: 'TOKEN_NOTVALID'
                                }
                            });
                        }
                    }
                } else {
                    req.token = decoded;
                    next();
                }
            })
        }
    }
}

module.exports = new Session();
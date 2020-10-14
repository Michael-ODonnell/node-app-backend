
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid')

const PRIVATE_SESSION_KEY = process.env.PRIVATE_SESSION_KEY;
const PUBLIC_SESSION_KEY = process.env.PUBLIC_SESSION_KEY;
const SESSION_KEY_ALGORITHM = process.env.SESSION_KEY_ALGORITHM;
const DEFAULT_SESSION_TTL = 300;

class Session {

    create(user, password, ttl = DEFAULT_SESSION_TTL){
        return bcrypt.compare(password, user.hash)
        .then(result => {
            if(result) {
                return this._buildSessionToken(user, ttl)
            }
            else {
                return Promise.reject({status: 403, error: 'Invalid login details'});
            }
        });
    }

    _buildSessionToken(user, ttl) {
        return new Promise((resolve, reject)=>{
            jwt.sign({
                username: user.username,
                email: user.email,
                session_id: uuid.v4(),
            }, PRIVATE_SESSION_KEY, {
                expiresIn: ttl,
                algorithm: SESSION_KEY_ALGORITHM
            }, (error, token) => {
                if(error) {
                    reject({status: 403, error});
                }
                else{
                    resolve({token, session_ttl: ttl});
                }
            })
        });
    }

    refresh(token, ttl = DEFAULT_SESSION_TTL){

        return new Promise((resolve, reject)=>{
            jwt.sign({
                username: token.username,
                email: token.email,
                session_id: token.session_id,
            }, PRIVATE_SESSION_KEY, {
                expiresIn: ttl,
                algorithm: SESSION_KEY_ALGORITHM
            }, (error, token) => {
                if(error) {
                    reject({status: 403, error});
                }
                else{
                    resolve({token, session_ttl: ttl});
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
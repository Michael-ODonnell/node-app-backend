const jwt = require('jsonwebtoken');

const {Subscriber} = require("../common/pubsub");

const PUBLIC_SESSION_KEY = process.env.PUBLIC_SESSION_KEY;

class Client {
    constructor(id, sessionToken, req, res){
        this.id = id;
        this._req = req;
        this._res = res;

        // Mandatory headers and http status to keep connection open
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);
        this._decode(sessionToken);
    }

    disconnected(){
        this._messageSubscriber.close();
        this._isConnected = false;
    }

    _decode(token){
        jwt.verify(token, PUBLIC_SESSION_KEY, (err, decoded)=>{
            if (err) {
                console.error(`Session error: ${err.name}`);
                this._res.write('Invalid Token');
                this._res.end();
            } else {
                this._session = decoded;
                this._isConnected = true;

                this._messageSubscriber = new Subscriber(`pubsub:${this._session.session_id}`);
                this._messageSubscriber.addHandler(message => this._res.write(`${message}\n`));
            }
        })
    }
}

module.exports = Client;

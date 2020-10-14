const express = require("express");
const bodyParser = require("body-parser");
const Client = require("./client");

const sse = express();
const port = 3001;

sse.use(bodyParser.json());
sse.listen(port, () => console.log(`SSE listening at http://localhost:${port}`));

let clients = [];

sse.get('/listen/:session', (req, res) => {
    const sessionToken = req.params.session;

    const clientId = Date.now();
    const client = new Client(clientId, sessionToken, req, res);
    if(client){
        clients.push(client);
    
        req.on('close', () => {
            client.disconnected();
            clients = clients.filter(c => c.id !== clientId);
        });
    }
});
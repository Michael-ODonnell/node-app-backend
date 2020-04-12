const express = require("express");
const bodyParser = require("body-parser");
const users = require('./routes/users');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('About World!');
});

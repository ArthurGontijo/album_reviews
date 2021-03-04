const express = require('express');
const app = express();

const user = require('./routes/user');

const pool = require('./db');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', user);


app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})
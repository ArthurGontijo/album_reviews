const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());


app.listen(3000, () => {
    console.log("server is listening on port 3000");
})
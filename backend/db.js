const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "gaspar11",
    database: "albums_database",
    host: "localhost",
    port: 5432
});

module.exports = pool;
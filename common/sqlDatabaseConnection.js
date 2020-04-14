const { Pool } = require('pg');

const pool = new Pool();

class SQLDatabaseConnection {
    executeQuery(query, args) {
        return pool.query(query, args)
        .then(res => {return res.rows})
    }
}

module.exports = new SQLDatabaseConnection();
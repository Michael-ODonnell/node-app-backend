const userQueries = {
insert: `
    INSERT INTO live_data.users (username) VALUES ($1) 
    RETURNING id;
    `,
getUserName: `
    SELECT username FROM live_data.users WHERE id = $1;
`
};

module.exports = userQueries;

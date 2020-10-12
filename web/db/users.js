const userQueries = {
insert: `
    INSERT INTO live_data.account (email, hash, username) VALUES ($1, $2, $3) 
    RETURNING email;
    `,
getAuthDetails: `
    SELECT hash, username FROM live_data.account WHERE email = $1;
    `,
getUserName: `
    SELECT username FROM live_data.account WHERE email = $1;
`
};

module.exports = userQueries;

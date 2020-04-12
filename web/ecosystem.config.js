module.exports = {
    apps : [{
      name        : "api",
      script      : "./web/app.js",
      instances  : 2,
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": "development",
        "PGUSER": "api",
        "PGHOST": "postgres",
        "PGPASSWORD": "api_password",
        "PGDATABASE": "postgres",
        "PGPORT": 5432
      },
      env_production : {
         "NODE_ENV": "production"
      }
    }]
  }
  
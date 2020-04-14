module.exports = {
    apps : [{
      name        : "api",
      script      : "./web/app.js",
      instances  : 2,
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": "development"
      },
      env_production : {
         "NODE_ENV": "production"
      }
    },
    {
      name        : "messagePrinter",
      script      : "./workers/messagePrinter.js",
      instances  : 2,
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": "development"
      },
      env_production : {
         "NODE_ENV": "production"
      }
    }]
  }
  
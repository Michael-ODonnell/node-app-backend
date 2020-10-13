module.exports = {
    apps : [{
      name        : "api",
      script      : "./web/app.js",
      instances  : 2,
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": "development",
        "SESSION_KEY_ALGORITHM":"HS256",
        "PRIVATE_SESSION_KEY": "DEV_SESSION_KEY",
        "PUBLIC_SESSION_KEY": "DEV_SESSION_KEY"
      },
      env_production : {
         "NODE_ENV": "production",
         "SESSION_KEY_ALGORITHM":"RS256",
         "PRIVATE_SESSION_KEY": "THIS_SHOULD_BE_AN_ACTUAL_RSA_PRIVATE_KEY_IF_YOU_CAN_READ_THIS_SOMETHING_IS_WRONG",
         "PUBLIC_SESSION_KEY": "THIS_SHOULD_BE_AN_ACTUAL_RSA_PUBLIC_KEY_IF_YOU_CAN_READ_THIS_SOMETHING_IS_WRONG"
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
  
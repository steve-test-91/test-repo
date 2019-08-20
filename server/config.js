const { ParseServer } = require('parse-server');

const envConfig = {
  port: process.env.PORT || 4000,
  masterKey: process.env.MASTER_KEY,
  sentryClientID: process.env.SENTRY_CLIENT_ID,
  sentryClientSecret: process.env.SENTRY_CLIENT_SECRET
};

const parseServer = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
  appId: 'sentry-integration-example',
  masterKey: envConfig.masterKey,
  serverURL: `http://localhost:${envConfig.port}/parse` // Don't forget to change to https if needed
});

module.exports = { envConfig, parseServer };

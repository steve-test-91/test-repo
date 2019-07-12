require('node-env-file')('.env');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const { envConfig } = require('./config');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.set('port', envConfig.port);

routes(router);

app.listen(envConfig.port, function(req, res) {
  console.log(`server listening on: localhost:${envConfig.port}`);
});

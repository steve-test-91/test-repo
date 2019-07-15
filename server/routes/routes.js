const path = require('path');
const express = require('express');
const _ = require('lodash');
const Sentry = require('@sentry/node');
const Parse = require('parse/node');

const { parseServer } = require('../config');
const issues = require('../services/issues');

require('../services/sentry');

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

const pathToBuild = '../../build';

const staticPage = (req, res) => {
  const indexPath = path.join(__dirname, `${pathToBuild}/index.html`);
  res.sendFile(indexPath);
};

const handleWebhook = async (req, res) => {
  try {
    const { action, data } = req.body;
    const { issue } = data;
    console.log('req.body', JSON.stringify(req.body));
    if (action === 'deleted') {
      return;
      const { installation } = data;
      const orgSlug = installation.organization.slug;
      const sentryUserConfig = await new Parse.Query('SentryUserConfig')
        .include('userPtr')
        .equalTo('orgSlug', orgSlug)
        .first({ useMasterKey: true });
      sentryUserConfig.unset('refreshToken');
      sentryUserConfig.unset('accessToken');
      sentryUserConfig.unset('installationId');
      sentryUserConfig.unset('orgSlug');
      await sentryUserConfig.save(null, { useMasterKey: true });
      await sentryUserConfig
        .get('userPtr')
        .save({ oauthComplete: false }, { useMasterKey: true });
    } else if (issue) {
      console.log('\n\n got issue', JSON.stringify(issue), '\n\n');
      const issueParams = _.omit(issue, ['id']);
      issueParams.sentryId = issue.id;
      let sentryIssue = await issues.findSentryIssue(issue.id);
      if (sentryIssue) {
        await sentryIssue.save({ issueParams }, { useMasterKey: true });
      } else {
        sentryIssue = await issues.createSentryIssue(issueParams);
      }
    }
    res.sendStatus(202);
  } catch (err) {
    console.error('err', err);
    res.sendStatus(500);
  }
};

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.use('/parse', parseServer);
  app.use('/webhook', handleWebhook);

  app.use(express.static(path.join(__dirname, pathToBuild)));
  app.get('*', staticPage);

  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    console.error('error', err);

    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });

  //keep at bottom
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error(`Not Found at ${req.url}`);
    err.status = 404;
    next(err);
  });
};

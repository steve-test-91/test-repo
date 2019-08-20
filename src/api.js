import Parse from 'parse';
import * as Sentry from '@sentry/browser';

const oldRun = Parse.Cloud.run;

Parse.Cloud.run = async (...args) => {
  try {
    return await oldRun.call(Parse.Cloud, ...args);
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
};

export const sentryOauth = async params => {
  await Parse.Cloud.run('sentryOauth', params);
};

export const getSentryIssues = async projectSlug => {
  return await Parse.Cloud.run('sentryIssues', { projectSlug });
};

export const getSentryProjectInfo = async projectSlug => {
  return await Parse.Cloud.run('sentryProjectInfo', { projectSlug });
};

export const getSentryProjects = async () => {
  return await Parse.Cloud.run('sentryProjects');
};

export const getUserIntegrations = async () => {
  return [];
};

export const addIntegration = async (
  integrationSlug,
  clientID,
  clientSecret
) => {
  return await Parse.Cloud.run('addIntegration', {
    integrationSlug,
    clientID,
    clientSecret
  });
};

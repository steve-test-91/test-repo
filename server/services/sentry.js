const Parse = require('parse/node');
const axios = require('axios');

const { envConfig } = require('../config');

const sentryApi = axios.create({
  baseURL: 'https://sentry.io',
  headers: { 'Content-Type': 'application/json' }
});

const createSentryUserConfig = async user => {
  const sentryUserConfig = new Parse.Object('SentryUserConfig');
  const acl = new Parse.ACL(user);
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  sentryUserConfig.setACL(acl);
  return sentryUserConfig.save({ userPtr: user }, { useMasterKey: true });
};

const makeSentryRequest = async (sentryUserConfig, axiosParams) => {
  try {
    return await _rawMakeSentryRequest(sentryUserConfig, axiosParams);
  } catch (err) {
    if (err.response.status === 401) {
      sentryUserConfig = await refreshAndSaveToken(sentryUserConfig);
      return await _rawMakeSentryRequest(sentryUserConfig, axiosParams);
    }
    throw err;
  }
};

const _rawMakeSentryRequest = async (sentryUserConfig, axiosParams) => {
  const accessToken = sentryUserConfig.get('accessToken');
  axiosParams.headers = Object.assign({}, axiosParams.headers, {
    Authorization: `Bearer ${accessToken}`
  });
  const { data } = await sentryApi.request(axiosParams);
  return data;
};

const refreshAndSaveToken = async sentryUserConfig => {
  const installationId = sentryUserConfig.get('installationId');
  const url = `api/0/sentry-app-installations/${installationId}/authorizations/`;

  const payload = {
    grant_type: 'refresh_token',
    refresh_token: sentryUserConfig.get('refreshToken'),
    client_id: envConfig.sentryClientID,
    client_secret: envConfig.sentryClientSecret
  };

  const { data } = await sentryApi.post(url, payload);
  return await sentryUserConfig.save(
    {
      refreshToken: data.refreshToken,
      accessToken: data.token
    },
    { useMasterKey: true }
  );
};

const getSentryUserConfig = async user => {
  const sentryUserConfig = await new Parse.Query('SentryUserConfig')
    .equalTo('userPtr', user)
    .first({ useMasterKey: true });
  return sentryUserConfig;
};

Parse.Cloud.define('sentryOauth', async req => {
  const {
    user,
    params: { code, installationId, orgSlug }
  } = req;

  let sentryUserConfig = await getSentryUserConfig(user);

  if (!sentryUserConfig) {
    sentryUserConfig = await createSentryUserConfig(user);
  }

  const url = `api/0/sentry-app-installations/${installationId}/authorizations/`;

  const payload = {
    grant_type: 'authorization_code',
    code,
    client_id: envConfig.sentryClientID,
    client_secret: envConfig.sentryClientSecret
  };

  try {
    const { data } = await sentryApi.post(url, payload);
    await sentryUserConfig.save(
      {
        refreshToken: data.refreshToken,
        accessToken: data.token,
        installationId,
        orgSlug
      },
      { useMasterKey: true }
    );

    await user.save({ oauthComplete: true }, { useMasterKey: true });

    return { message: 'ok' };
  } catch (err) {
    console.error(err);
    throw err;
  }
});

Parse.Cloud.define('sentryIssues', async req => {
  const {
    user,
    params: { projectSlug }
  } = req;
  const sentryUserConfig = await getSentryUserConfig(user);
  const orgSlug = sentryUserConfig.get('orgSlug');
  return await makeSentryRequest(sentryUserConfig, {
    method: 'GET',
    url: `/api/0/projects/${orgSlug}/${projectSlug}/issues/`
  });
});

Parse.Cloud.define('sentryProjects', async req => {
  const { user } = req;
  const sentryUserConfig = await getSentryUserConfig(user);
  const orgSlug = sentryUserConfig.get('orgSlug');
  return await makeSentryRequest(sentryUserConfig, {
    method: 'GET',
    url: `/api/0/organizations/${orgSlug}/projects/`
  });
});



Parse.Cloud.define('sentryProjectInfo', async req => {
  const {
    user,
    params: { projectSlug }
  } = req;
  const sentryUserConfig = await getSentryUserConfig(user);
  const orgSlug = sentryUserConfig.get('orgSlug');
  return await makeSentryRequest(sentryUserConfig, {
    method: 'GET',
    url: `/api/0/projects/${orgSlug}/${projectSlug}/`
  });
});

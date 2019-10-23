const Parse = require('parse/node');

// const createSentryIssue = async (user, params={}) => {
//   const sentryIssue = new Parse.Object('SentryIssue');
//   const acl = new Parse.ACL(user);
//   acl.setPublicReadAccess(false);
//   acl.setPublicWriteAccess(false);
//   acl.setReadAccess(user, true);
//   acl.setWriteAccess(user, false)
//   sentryIssue.setACL(acl);
//   return sentryIssue.save({ userPtr: user, ...params }, { useMasterKey: true });
// };

const createSentryIssue = async (params = {}) => {
  const sentryIssue = new Parse.Object('SentryIssue');
  const acl = new Parse.ACL();
  sentryIssue.setACL(acl);
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  return sentryIssue.save(params, { useMasterKey: true });
};

const findSentryIssue = sentryId => {
  return new Parse.Query('SentryIssue')
    .equalTo('sentryId', sentryId)
    .first({ useMasterKey: true });
};

const handleLists = (req, res) => {
  const { query } = req;
  return res.send([
    { label: 'option a', value: 'a' },
    { label: 'option b', value: 'b' }
  ]);
};

const handleTasks = (req, res) => {
  const { query } = req;
  return res.send([
    { label: 'option a', value: 'a' },
    { label: 'option b', value: 'b' }
  ]);
};

module.exports = {
  createSentryIssue,
  findSentryIssue,
  handleTasks,
  handleLists
};

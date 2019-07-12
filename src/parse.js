import Parse from 'parse';

Parse.initialize('sentry-integration-example', 'sentry-integration-example');

Parse.serverURL = `${window.location.origin}/parse`;

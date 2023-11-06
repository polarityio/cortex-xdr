const {
  requests: { createRequestWithDefaults, createRequestsInParallel }
} = require('polarity-integration-utils');

const requestWithDefaults = createRequestWithDefaults({
  config: require('../config/config'),
  requestOptionsToOmitFromLogsKeyPaths: [
    'headers.Authorization',
    'headers.x-xdr-auth-id'
  ],
  preprocessRequestOptions: ({ options, route, ...requestOptions }) => {
    return {
      ...requestOptions,
      url: `${options.url}/public_api/v1/${route}`,
      headers: {
        Authorization: options.apiKey,
        'x-xdr-auth-id': options.apiKeyId,
        'Content-Type': 'application/json'
      },
      json: true
    };
  }
});

const requestsInParallel = createRequestsInParallel(requestWithDefaults);


const NodeCache = require('node-cache');

const xqlQueryResultsCache = new NodeCache();

module.exports = {
  requestWithDefaults,
  requestsInParallel,
  xqlQueryResultsCache
};

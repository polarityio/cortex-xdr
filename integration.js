'use strict';
const { get } = require('lodash');
const {
  logging: { setLogger, getLogger },
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');

const { buildIgnoreResults, organizeEntities } = require('./server/dataTransformations');

const { validateOptions } = require('./server/userOptions');
const searchEntities = require('./server/searchEntities');
const assembleLookupResults = require('./server/assembleLookupResults');

const { searchXqlQuery } = require('./server/queries');
const onMessageFunctions = require('./server/onMessage');

const doLookup = async (entities, _options, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');

    const options = {
      ..._options,
      maxConcurrent: 1,
      minimumMillisecondsRequestWillTake: 110
    };

    const { searchableEntities, nonSearchableEntities } = organizeEntities(entities);

    const { incidents, cachedXqlQueryResults } = await searchEntities(
      searchableEntities,
      options
    );

    Logger.trace({ incidents, cachedXqlQueryResults });

    const lookupResults = assembleLookupResults(
      entities,
      incidents,
      cachedXqlQueryResults,
      options
    );

    const ignoreResults = buildIgnoreResults(nonSearchableEntities);

    Logger.trace({ lookupResults, ignoreResults }, 'Lookup Results');

    cb(null, lookupResults.concat(ignoreResults));
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

const onDetails = async (lookupObject, options, cb) => {
  const xqlQueryJobId = get(lookupObject, 'data.details.doXqlQuery', false)
    && await searchXqlQuery(lookupObject.entity, options);

  cb(null, {
    ...lookupObject.data,
    details: { ...lookupObject.data.details, xqlQueryJobId }
  });
};

const onMessage = ({ action, data: actionParams }, options, callback) =>
  onMessageFunctions[action](actionParams, options, callback);

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup,
  onDetails,
  onMessage
};

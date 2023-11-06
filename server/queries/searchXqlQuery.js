const { flow, map, replace, filter, size, isArray, some } = require('lodash/fp');
const {
  requestsInParallel,
  xqlQueryResultsCache,
} = require('../request');

const escapeQuotes = replace(/(\r\n|\n|\r)/gm, '');

const searchXqlQuery = async (entities, options) => {
  const cachedXqlQueryResults = flow(
    map((entity) => ({
      entity,
      result: xqlQueryResultsCache.get(entity.value + options.xqlQueryString)
    })),
    filter(({ result }) => isArray(result) && size(result))
  )(entities);

  const entitiesWithoutCachedResults = filter(
    (entity) =>
      !some(
        (xqlQueryResult) => xqlQueryResult.entity.value === entity.value,
        cachedXqlQueryResults
      ),
    entities
  );
  const xqlQueryJobIds = await flow(
    map((entity) => ({
      entity,
      method: 'POST',
      route: 'xql/start_xql_query',
      body: {
        request_data: {
          query: replace(
            /{{ENTITY}}/gi,
            escapeQuotes(entity.value),
            options.xqlQueryString
          )
        }
      },
      options
    })),
    async (alertSearchRequests) =>
      await requestsInParallel(alertSearchRequests, 'body.reply')
  )(entitiesWithoutCachedResults);

  return {
    cachedXqlQueryResults,
    xqlQueryJobIds
  };
};
module.exports = searchXqlQuery;

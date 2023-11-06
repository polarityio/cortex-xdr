const { flow, get, size, find, eq, map, some, first } = require('lodash/fp');

const assembleLookupResults = (
  entities,
  incidents,
  xqlQueryJobIds,
  cachedXqlQueryResults,
  options
) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      incidents,
      xqlQueryJobIds,
      cachedXqlQueryResults,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultForThisEntity = (entity, results) =>
  flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

const getResultsForThisEntity = (
  entity,
  incidents,
  xqlQueryJobIds,
  cachedXqlQueryResults
) => ({
  incidents: getResultForThisEntity(entity, incidents),
  xqlQueryJobId: getResultForThisEntity(entity, xqlQueryJobIds),
  xqlQueryResults: getResultForThisEntity(entity, cachedXqlQueryResults)
});

const createSummaryTags = ({ incidents, xqlQueryResults, xqlQueryJobId }, options) => {
  return []
    .concat(size(incidents) ? `Incidents Found: ${size(incidents)}` : [])
    .concat(size(xqlQueryResults) ? `XQL Results: ${size(xqlQueryResults)}` : [])
    .concat(xqlQueryJobId ? `XQL Query Ran` : []);
};

module.exports = assembleLookupResults;

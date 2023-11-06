const { searchIncidents, searchXqlQuery } = require('./queries');

const searchEntities = async (entities, options) => {
  const [incidents, { cachedXqlQueryResults, xqlQueryJobIds }] = await Promise.all([
    searchIncidents(entities, options),
    options.doXqlQueries
      ? searchXqlQuery(entities, options)
      : { cachedXqlQueryResults: [], xqlQueryJobIds: [] }
  ]);

  return { incidents, xqlQueryJobIds, cachedXqlQueryResults };
};

module.exports = searchEntities;

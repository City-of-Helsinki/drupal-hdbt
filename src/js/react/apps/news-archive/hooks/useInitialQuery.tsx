import IndexFields from '../enum/IndexFields';
import useLanguageQuery from './useLanguageQuery';

const termFilter = {
  term: { entity_type: 'taxonomy_term' },
};

const useInitialQuery = () => {
  const languageFilter = useLanguageQuery();

  const getAggQuery = (key: string, vid: string) => ({
    aggs: {
      [key]: {
        multi_terms: {
          terms: [
            {
              field: 'name',
            },
            {
              field: 'tid',
            },
          ],
          size: 100000,
          order: {
            _key: 'asc',
          },
        },
      },
    },
    query: {
      bool: {
        filter: [{ term: { vid } }, termFilter, ...languageFilter.bool.filter],
      },
    },
    size: 10000,
  });

  const aggMap = {
    [IndexFields.FIELD_NEWS_ITEM_TAGS]: 'news_tags',
    [IndexFields.FIELD_NEWS_NEIGHBOURHOODS]: 'news_neighbourhoods',
    [IndexFields.FIELD_NEWS_GROUPS]: 'news_group',
  };

  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
  const queries: any[] = [];

  // Aggregations for field options
  Object.keys(aggMap).forEach((key) => {
    queries.push(getAggQuery(key, aggMap[key]));
  });

  const ndjsonHeader = '{}';
  let body = '';

  queries.forEach((query) => {
    body += `${ndjsonHeader}\n${JSON.stringify(query)}\n`;
  });

  return body;
};

export default useInitialQuery;

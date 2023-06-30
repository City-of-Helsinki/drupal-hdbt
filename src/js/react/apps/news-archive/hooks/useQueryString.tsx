import useLanguageQuery from '@/react/common/hooks/useLanguageQuery';
import IndexFields from '../enum/IndexFields';
import URLParams from '../types/URLParams';



const useQueryString = (urlParams: URLParams) => {
  const languageFilter = useLanguageQuery();
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const must: any[] = [];

  const termFilter = {
    term: { entity_type: 'taxonomy_term' },
  };

  const getFieldAgg = (key: string, vid: string) => ({
    aggs: {
      [key]: {
        multi_terms: {
          terms: [
            {
              field: 'tid',
            },
            {
              field: 'name',
            },
          ],
          size: 100000,
        },
      },
    },
    query: {
      bool: {
        filter: [{ term: { vid: vid } }, termFilter, ...languageFilter.bool.filter],
      },
    },
  });

  if (urlParams?.topic?.length) {
    must.push({
      terms: {
        [IndexFields.NEWS_TAGS]: urlParams.topic
      }
    });
  }

  if (urlParams?.groups?.length) {
    must.push({
      terms: {
        [IndexFields.NEWS_GROUPS]: urlParams.groups
      }
    });
  }

  if (urlParams?.neighbourhoods?.length) {
    must.push({
      terms: {
        [IndexFields.NEIGHBOURHOODS]: urlParams.neighbourhoods
      }
    });
  }

  let query: any = {
    ...languageFilter
  }

  let aggs: any = {};

  const aggMap = {
    [IndexFields.FIELD_NEWS_ITEM_TAGS]: 'news_tags',
    [IndexFields.FIELD_NEWS_NEIGHBOURHOODS]: 'news_neighbourhoods',
    [IndexFields.NEWS_GROUPS]: 'news_group'
  };

  // Aggregations for field options
  for (const key in aggMap) {
    aggs[key] = getFieldAgg(key, aggMap[key]);
  }

  return JSON.stringify({
    sort: sort,
    size,
    from: size * (page - 1),
    query
  })
}

export default useQueryString;

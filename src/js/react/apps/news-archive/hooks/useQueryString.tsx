import { estypes } from '@elastic/elasticsearch';

import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import URLParams from '../types/URLParams';
import useLanguageQuery from '../hooks/useLanguageQuery';

const useQueryString = (urlParams: URLParams): string => {
  const languageFilter = useLanguageQuery();
  const size = drupalSettings?.helfi_news_archive?.max_results ?? Global.SIZE;
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const must: estypes.QueryDslQueryContainer[] = [];

  // Add entity type filteration to languageFilter so that only nodes are listed on results.
  if (languageFilter?.bool?.filter) {
    must.push({
      term: {
        entity_type: 'node'
      }
    });
  }

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

  if (urlParams?.keyword?.length) {
    must.push({
      bool: {
        should: [
          {
            query_string: {
              query: `${urlParams.keyword.toString().toLowerCase()}~`,
              fields: [
                `${IndexFields.TITLE}^2`,
                `${IndexFields.FIELD_LEAD_IN}^1.5`,
                `${IndexFields.TEXT_CONTENT}^.1`,
              ]
            }
          },
          {
            wildcard: {
              [`${IndexFields.TITLE}.keyword`]: `*${urlParams.keyword}*`
            }
          }
        ],
        minimum_should_match: 1,
      }
    });
  }

  const query: any = {
    ...languageFilter
  };

  if (must.length) {
    query.bool.must = must;
  }

  const result: estypes.SearchRequest = {
    from: size * (page - 1),
    query,
    sort: [
      '_score',
      {
        [IndexFields.PUBLISHED_AT]: 'desc'
      }
    ],
    size,
  };

  return JSON.stringify(result);
};

export default useQueryString;

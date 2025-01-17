import useLanguageQuery from '../hooks/useLanguageQuery';
import IndexFields from '../enum/IndexFields';
import URLParams from '../types/URLParams';
import Global from '../enum/Global';

const useQueryString = (urlParams: URLParams) => {
  const languageFilter = useLanguageQuery();
  const size = drupalSettings?.helfi_news_archive?.max_results ?? Global.SIZE;
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const must: any[] = [];

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

  const query: any = {
    ...languageFilter
  };

  if (must.length) {
    query.bool.must = must;
  }

  return JSON.stringify({
    size,
    from: size * (page - 1),
    query,
    sort: [
      {
        [IndexFields.PUBLISHED_AT]: 'desc'
      }
    ]
  });
};

export default useQueryString;

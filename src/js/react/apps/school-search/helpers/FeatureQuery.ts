import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';
import IndexFields from '../enum/IndexFields';
import SearchParams from '../types/SearchParams';

// Filter by current language
export const languageFilter: any = {
  term: { [`${IndexFields.LANGUAGE}`]: window.drupalSettings.path.currentLanguage || 'fi' },
};

const getCheckBoxFilters = (params: SearchParams) => {
  const languageKeys = ['finnish_education', 'swedish_education'];
  const gradeKeys = ['grades_1_6', 'grades_1_9', 'grades_7_9'];
  const query: any = [];

  [languageKeys, gradeKeys].forEach((keys) => {
    const hits: string[] = [];

    keys.forEach((key: string) => {
      if (params[key as keyof SearchParams]) {
        hits.push(key);
      }
    });

    if (hits.length) {
      query.push({
        bool: {
          minimum_should_match: 1,
          should: hits.map((hit) => ({
            term: {
              [`additional_filters.${hit}`]: true
            }
          }))
        }
      });
    }
  });

  return query;
};

// Base aggregations
export const AGGREGATIONS = {
  aggs: {
    ontologywordIds: {
      terms: {
        field: 'ontologyword_ids',
        size: 100,
      },
    },
  },
  query: {
    bool: {
      filter: [languageFilter],
    },
  },
};

const getQueryString = (params: SearchParams, page: number) => {
  const { size } = GlobalSettings;
  const { keyword, a1 } = params;
  console.log('query params', params);

  const query: BooleanQuery = {
    bool: {
      filter: [
        {
          term: {
            _language: drupalSettings.path.currentLanguage
          }
        }
      ],
    }
  };

  if (keyword && keyword.length) {
    query.bool.should = [
      {
        match_phrase_prefix: {
          name: {
            query: keyword,
            boost: 1.5
          },
        }
      },
      {
        match: {
          name: {
            query: keyword
          }
        }
      },
      {
        wildcard: {
          name: {
            value: `*${keyword}*`
          }
        }
      },
      {
        term: {
          'postal_code': keyword
        }
      }
    ];

    query.bool.minimum_should_match = 1;
  }

  const checkBoxFilters: any = getCheckBoxFilters(params);
  if (checkBoxFilters.length) {
      query.bool.must = [{
        nested: {
        path: 'additional_filters',
        query: {
          bool: {
            must: checkBoxFilters
          }
        }
      }
    }];
  };

  if (a1 && a1.length) {
    a1.forEach((ontologyword_id: any) => {
      console.log('jee', ontologyword_id);
    });
    // query.bool.must = [{
    //   path: 'ontologyword_ids',
    //   query: {
    //     bool: {
    //       must: a1
    //     }
    //   }
    // }];
  }

  const sort: any[] = [
    {
      'name.keyword': 'asc'
    }
  ];

  if (keyword?.length) {
    sort.unshift({
      _score: 'desc'
    });
  }

  return JSON.stringify({
    aggs: {
      ids: {
        terms: {
          field: 'id',
          size: 1000
        },
      },
    },
    from: size * (page - 1),
    query,
    size,
    sort,
  });
};

export default getQueryString;

import GlobalSettings from '../enum/GlobalSettings';
import BooleanQuery from '@/types/BooleanQuery';
import SearchParams from '../types/SearchParams';
import UseFeatureQuery from '../hooks/UseFeatureQuery';

const getCheckBoxFilters = (params: SearchParams) => {
  const languageKeys = ['finnish_education', 'swedish_education'];
  const gradeKeys = ['grades_1_6', 'grades_7_9'];
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

const getQueryString = (params: SearchParams) => {
  const { size } = GlobalSettings;
  const { keyword } = params;

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

  return JSON.stringify({
    aggs: {
      ids: {
        terms: {
          field: 'id',
          size: 1000
        },
      },
    },
    query,
    size,
    sort: [
      {
        _score: 'desc',
      },
      {
        'name.keyword': 'asc'
      }
    ]
  });
};

export default getQueryString;

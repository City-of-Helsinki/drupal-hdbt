import GlobalSettings from '../enum/GlobalSettings';
import BooleanQuery from '@/types/BooleanQuery';
import SearchParams from '../types/SearchParams';

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
  
  const checkBoxFilters: any = [];
  ['finnish_education', 'swedish_education', 'grades_1_6', 'grades_7_9'].forEach(key => {
    if (!params[key as keyof SearchParams]) {
      return;
    };

    checkBoxFilters.push({
      term: {
        [`additional_filters.${key}`]: true
      }
    });
  });

  if (checkBoxFilters.length) {
      query.bool.must = [{
        nested: {
        path: 'additional_filters',
        query: {
          bool: {
            should: checkBoxFilters,
            minimum_should_match: 1
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

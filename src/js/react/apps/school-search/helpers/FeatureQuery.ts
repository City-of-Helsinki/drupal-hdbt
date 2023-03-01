import GlobalSettings from '../enum/GlobalSettings';
import BooleanQuery from '@/types/BooleanQuery';

const getQueryString = (keyword?: string) => {
  const { size } = GlobalSettings;

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
          'postal_code.keyword': keyword
        }
      }
    ];

    query.bool.minimum_should_match = 1;
  }
  

  return JSON.stringify({
    aggs: {
      ids: {
        terms: {
          field: 'id.keyword',
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

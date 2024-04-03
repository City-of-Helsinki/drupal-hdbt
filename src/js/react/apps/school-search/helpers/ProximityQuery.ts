import BooleanQuery from '@/types/BooleanQuery';
import AppSettings from '../enum/AppSettings';

const getQueryString = (ids: number[]|null, coordinates: number[]|null, page: number) => {
  const { size } = AppSettings;
  const lang = drupalSettings.path.currentLanguage;

  const query: BooleanQuery = {
    bool: {
      filter: [
        {
          term: {
            _language: lang
          }
        }
      ],
    }
  };

  if (ids && Array.isArray(ids)) {
    query.bool.must = [
      {
        terms: {
          id: ids
        }
      }
    ];

    query.bool.should = [
      // Show finnish schools first when using fi or en, swedish when sv
      {
        nested: {
          path: 'additional_filters',
          query: {
            constant_score: {
              boost: 1,
              filter: {
                term: {
                  [lang === 'sv' ? 'additional_filters.swedish_education' : 'additional_filters.finnish_education']: {
                    value: true,
                  }
                }
              }
            }
          },
        }
      },
    ];
  }

  let sort: any = [{'name.keyword':'asc'}];

  if (coordinates && coordinates.length) {
    sort = [{_score:'desc'}, ...sort];
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
    sort
  });
};

export default getQueryString;

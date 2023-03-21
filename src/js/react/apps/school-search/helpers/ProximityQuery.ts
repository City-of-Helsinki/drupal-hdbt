import GlobalSettings from '../enum/GlobalSettings';
import BooleanQuery from '@/types/BooleanQuery';

const getQueryString = (ids: number[]|null, coordinates: number[]|null, page: number) => {
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

  if (ids && ids.length) {
    query.bool.must = [
      {
        terms: {
          id: ids
        }
      }
    ];
  
    query.bool.should = [
      // Show finnish schools first
      {
        nested: {
          path: 'additional_filters',
          query: {
            term: {
              'additional_filters.finnish_education': {
                value: true,
                boost: 20
              }
            }
          }
        }
      },
      // Show 1-6 classes before 7-9
      {
        nested: {
          path: 'additional_filters',
          query: {
            term: {
              'additional_filters.grades_1_6': {
                value: true,
                boost: 10
              }
            }
          }
        }
      }
    ];
  }

  let sort: any = [
    {
      'name.keyword': 'asc'
    }
  ];

  if (coordinates && coordinates.length) {
    const [lat, lon] = coordinates;

    sort = [
      {
        _score: 'desc'
      },
      {
      _geo_distance: {
        coordinates: {
          lat,
          lon,
        },
        order: 'asc',
        unit: 'm',
        distance_type: 'arc',
        ignore_unmapped: true
      }
    }, ...sort];
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
    from: size * (page - 1),
    query,
    size,
    sort
  });
};

export default getQueryString;

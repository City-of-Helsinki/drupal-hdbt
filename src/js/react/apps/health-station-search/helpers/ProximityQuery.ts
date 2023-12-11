import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';

const getQueryString = (ids: number[]|null, coordinates: number[]|null, page: number, svOnly?: boolean) => {
  let { size } = GlobalSettings;
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

  if (svOnly) {
    query.bool.filter?.push({
      term: {
        provided_languages: 'sv'
      }
    });
  }

  // Don't query by id, when sv_only filter is set.
  if (ids && Array.isArray(ids) && !svOnly) {
    query.bool.must = [
      {
        terms: {
          id: ids
        }
      }
    ];
  }

  let sort: any = [{ 'name_override': 'asc' }];

  if (coordinates && coordinates.length) {
    sort = [{ _score: 'desc' }, ...sort];

    // Show closest station with Service in Swedish.
    if (svOnly) {
      sort = [
        {
          _geo_distance: {
            coordinates: {
              lat: coordinates[0],
              lon: coordinates[1]
            },
            order: 'asc',
            mode: 'min',
            distance_type: 'arc',
            ignore_unmapped: true
          }
        }
      ];

      size = 1;
    }
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

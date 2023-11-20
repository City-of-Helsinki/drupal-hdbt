import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';

const getQueryString = (ids: number[]|null, coordinates: number[]|null, page: number, svOnly?: boolean) => {
  const { size } = GlobalSettings;
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

  if (ids && Array.isArray(ids)) {
    query.bool.must = [
      {
        terms: {
          id: ids
        }
      }
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

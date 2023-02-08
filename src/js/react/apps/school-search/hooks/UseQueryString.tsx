import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';
import UseAddressQuery from './UseAddressQuery';

const UseQueryString = () => {
  const { size } = GlobalSettings;
  const { ids } = UseAddressQuery();

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
  }

  return JSON.stringify({
    query,
    size,
    sort: [
      {
        'name.keyword': 'asc'
      }
    ]
  });
};

export default UseQueryString;

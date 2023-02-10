import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';
import UseAddressQuery from './UseAddressQuery';

const UseQueryString = () => {
  const { ids, coordinates } = UseAddressQuery();
  const { size } = GlobalSettings;

  console.log(ids);

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

  let sort: any = [
    {
      name: 'asc'
    }
  ];

  if (coordinates) {
    const [lat, lon] = coordinates;

   sort =[{
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
    query,
    size,
    sort
  });
};

export default UseQueryString;

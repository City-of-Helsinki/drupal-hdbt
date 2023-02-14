import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';
import UseAddressQuery from './UseAddressQuery';
import UseCoordinates from './UseCoordinates';

const UseQueryString = () => {
  const { size } = GlobalSettings;
  const { coordinates, ids, isLoading } = UseAddressQuery();

  console.log(coordinates, ids, isLoading);

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

  if (coordinates.length) {
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

import BooleanQuery from '@/types/BooleanQuery';
import GlobalSettings from '../enum/GlobalSettings';
import UseAddressQuery from './UseAddressQuery';
import UseCoordinates from './UseCoordinates';
import SearchParams from '../types/SearchParams';

const UseQuery = (params: SearchParams) => {
  const { address } = params;
  const { size } = GlobalSettings;
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const { coordinates, isLoading: coordsLoading, isValidating: coordsValidating, noResults } = UseCoordinates(address);
  const { ids, isLoading: idsLoading, isValidating: idsValidating } = UseAddressQuery(coordinates);

  console.log(coordinates, ids);

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

  if (coordinates && coordinates.length) {
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

  return {
    noResults,
    url: JSON.stringify({
      from: size * (page - 1),
      query,
      size,
      sort
    })
  };
};

export default UseQuery;

import useSWR from 'swr';
import GlobalSettings from '../enum/GlobalSettings';
import UseCoordinates from './UseCoordinates';

const getLocationsQuery = (lat: number|undefined, lon: number|undefined) => {
  const { locationsBaseUrl } = GlobalSettings;

  const url = new URL(locationsBaseUrl);
  const params = new URLSearchParams(url.search);

  if (lat && lon) {
    params.set('lon', lon.toString());
    params.set('lat', lat.toString());
  }

  url.search = params.toString();

  return url.toString();
};

const UseAddressQuery = () => {
  const { coordinates, isLoading: coordinatesLoading } = UseCoordinates();

  const fetcher = () => {
    const [lat, lon] = coordinates;
    return fetch(getLocationsQuery(lat, lon)).then(res => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(coordinates, fetcher, {
    revalidateOnFocus: false
  });

  const ids = (data && data.results) ? data.results.map((result: {service_point_id: string}) => result.service_point_id) : [];

  return {
    coordinates,
    error,
    ids,
    isLoading,
    isValidating
  };
};

export default UseAddressQuery;

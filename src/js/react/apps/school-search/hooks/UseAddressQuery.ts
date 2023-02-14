import useSWR from 'swr';
import GlobalSettings from '../enum/GlobalSettings';

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

const UseAddressQuery = (coordinates: number[]|null) => {
  const fetcher = () => {
    if (!coordinates) {
      return null;
    }

    const [lat, lon] = coordinates;
    return fetch(getLocationsQuery(lat, lon)).then(res => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(coordinates ? coordinates.toString() : null, fetcher, {
    revalidateOnFocus: false
  });

  const ids = (data && data.results) ? data.results.map((result: {service_point_id: string}) => result.service_point_id) : [];

  return {
    error,
    ids,
    isLoading,
    isValidating
  };
};

export default UseAddressQuery;

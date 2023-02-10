import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { paramsAtom } from '../store';
import GlobalSettings from '../enum/GlobalSettings';
import UseCoordinates from './UseCoordinates';

const getLocationsQuery = (lon: number, lat: number) => {
  const { locationsBaseUrl } = GlobalSettings;

  const url = new URL(locationsBaseUrl);
  const params = new URLSearchParams(url.search);
  params.set('lon', lon.toString());
  params.set('lat', lat.toString());
  url.search = params.toString();

  return url.toString();
};

const UseAddressQuery = () => {
  const params = useAtomValue(paramsAtom);
  const { address } = params;
  const coordinates = UseCoordinates(address);

  const fetcher = () => {
    // Bail if no coordinates
    if (!coordinates) {
      return null;
    }

    const [lat, lon] = coordinates;

    return fetch(getLocationsQuery(lon, lat)).then((res) => res.json());
  };

  const { data, error } = useSWR(coordinates, fetcher, {
    revalidateOnFocus: false
  });

  if (!data) {
    return {
      ids: [],
      coordinates,
      error
    };
  }

  const { results } = data;
  const ids = results ? results.map((result: {service_point_id: string}) => result.service_point_id) : [];

  return {
    ids,
    coordinates,
    error 
  };
};

export default UseAddressQuery;

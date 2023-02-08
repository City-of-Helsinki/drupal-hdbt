import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { addressQueriesAtom, paramsAtom } from '../store';
import GlobalSettings from '../enum/GlobalSettings';

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
  const { address, coordsUrl } = useAtomValue(addressQueriesAtom);
  const params = useAtomValue(paramsAtom);

  const fetcher = async() => {
    console.log(address);

    // No need to query if address is not set
    if (!address || !address.length) {
      return null;
    }

    // Get coordinates for the address
    const coordsResponse = await fetch(coordsUrl).then((res) => res.json());

    // Bail if no data
    if (!coordsResponse || !coordsResponse.results || !coordsResponse.results.length) {
      return null;
    }

    const [lon, lat] = coordsResponse.results[0].location.coordinates;

    // Bail if no coordinates.
    if (!lon || !lat) {
      return null;
    }

    return fetch(getLocationsQuery(lon, lat)).then((res) => res.json());
  };

  const { data, error } = useSWR(coordsUrl, fetcher, {
    revalidateOnFocus: false
  });

  if (!data) {
    return {
      ids: [],
      error
    };
  }

  const { results } = data;
  const ids = results ? results.map((result: {service_point_id: string}) => result.service_point_id) : [];

  return {
    ids,
    error 
  };
};

export default UseAddressQuery;

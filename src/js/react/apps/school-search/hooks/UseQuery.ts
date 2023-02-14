import useSWR from 'swr';
import { useAtomValue } from 'jotai';
import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import { getCoordsUrl, getLocationsUrl, parseCoordinates } from '../helpers/SubQueries';
import getQueryString from '../helpers/ElasticQuery';
import GlobalSettings from '../enum/GlobalSettings';

const UseQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const { address } = params;
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async() => {
    const { index } = GlobalSettings;

    let coordinates = null;
    let ids = null;

    if (address) {
      const coordinatesRes = await fetch(getCoordsUrl(address));
      const coordinatesData = await coordinatesRes.json();

      coordinates = parseCoordinates(coordinatesData);
    }

    if (coordinates && coordinates.length) {
      const [lat, lon] = coordinates;
      const locationsResponse = await fetch(getLocationsUrl(lat, lon));
      const locationsData = await locationsResponse.json();

      if (!locationsData || !locationsData.results) {
        return null;
      }

      ids = locationsData.results.map((result: {service_point_id: string}) => result.service_point_id);
    }

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(ids, coordinates, page),
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(address, fetcher, {
    revalidateOnFocus: false
  });

  return {
    data,
    error
  };
};

export default UseQuery;

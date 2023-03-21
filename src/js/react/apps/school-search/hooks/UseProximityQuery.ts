import useSWR from 'swr';
import { useAtomValue } from 'jotai';
import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import { getCoordsUrl, getLocationsUrl, parseCoordinates } from '../helpers/SubQueries';
import getQueryString from '../helpers/ProximityQuery';
import GlobalSettings from '../enum/GlobalSettings';

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async() => {
    const { index } = GlobalSettings;
    const { keyword } = params;

    let coordinates = null;
    let ids = null;

    if (keyword && keyword) {
      const coordinatesRes = await fetch(getCoordsUrl(keyword));
      const coordinatesData = await coordinatesRes.json();

      coordinates = parseCoordinates(coordinatesData);
    }

    if (keyword && !coordinates) {
      return null;
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

  const { data, error, isLoading, isValidating } = useSWR(`_${  Object.values(params).toString()}`, fetcher, {
    revalidateOnFocus: false
  });

  return {
    data,
    error,
    isLoading,
    isValidating
  };
};

export default UseProximityQuery;

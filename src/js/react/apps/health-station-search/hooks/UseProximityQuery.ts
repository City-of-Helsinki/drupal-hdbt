import useSWR from 'swr';
import { useAtomValue } from 'jotai';

import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import { getAddressUrls, getLocationsUrl, getAddresses, parseCoordinates } from '../helpers/SubQueries';
import getQueryString from '../helpers/ProximityQuery';
import GlobalSettings from '../enum/GlobalSettings';

type Unit = {
  id?: number
};

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async () => {
    const { index } = GlobalSettings;
    const { keyword, sv_only } = params;

    let coordinates = null;
    let ids = null;

    if (keyword) {
      const addresses = await getAddresses(getAddressUrls(keyword));
      coordinates = parseCoordinates(addresses);
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

      ids = locationsData.results.map((result: { unit: Unit }) => result.unit.id);
    }

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(ids, coordinates, page, sv_only),
    }).then((res) => res.json());
  };

  const { data, error, isLoading, isValidating } = useSWR(`_${Object.values(params).toString()}`, fetcher, {
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

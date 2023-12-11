import useSWR from 'swr';
import { useAtomValue } from 'jotai';

import { getAddressUrls, getLocationsUrl, getAddresses, parseCoordinates } from '@/react/common/helpers/SubQueries';
import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import getQueryString from '../helpers/ProximityQuery';
import AppSettings from '../enum/AppSettings';

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);
  const { locationsBaseUrl } = AppSettings;

  const fetcher = async () => {
    const { index } = AppSettings;
    const { keyword } = params;

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
      const locationsResponse = await fetch(getLocationsUrl(locationsBaseUrl, lat, lon));
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

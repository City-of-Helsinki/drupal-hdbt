import useSWR from 'swr';
import { useAtomValue } from 'jotai';

import { getAddressUrls, getLocationsUrl, getAddresses, parseCoordinates } from '@/react/common/helpers/SubQueries';
import SearchParams from '../types/SearchParams';
import configurationsAtom from '../store';
import getQueryString from '../helpers/ProximityQuery';
import AppSettings from '../enum/AppSettings';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

type Result = {
  units?: number[]
};

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const { locationsBaseUrl } = AppSettings;
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async () => {
    const { index } = AppSettings;
    const { address, sv_only } = params;

    let coordinates = null;
    let ids = null;

    if (address) {
      let addresses = await getAddresses(getAddressUrls(address));
      addresses = addresses.filter((_address: any) => _address.results.length);

      if (addresses.length) {
        coordinates = parseCoordinates(addresses);
      }
    }

    if (address && !coordinates) {
      return null;
    }

    if (coordinates && coordinates.length) {
      const [lat, lon] = coordinates;
      const locationsResponse = await fetch(getLocationsUrl(locationsBaseUrl, lat, lon));
      const locationsData = await locationsResponse.json();

      if (!locationsData || !locationsData.results) {
        return null;
      }

      ids = locationsData.results.flatMap((result: Result) => result.units ?? []);
    }

    return useTimeoutFetch(`${baseUrl}/${index}/_search`, {
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

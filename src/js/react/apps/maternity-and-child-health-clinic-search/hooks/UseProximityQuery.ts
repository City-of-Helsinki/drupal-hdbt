import useSWR from 'swr';
import { useAtomValue } from 'jotai';

import { getAddressUrls, getLocationsUrl, getAddresses, parseCoordinates } from '@/react/common/helpers/SubQueries';
import SearchParams from '../types/SearchParams';
import { configurationsAtom } from '../store';
import getQueryString from '../helpers/ProximityQuery';
import AppSettings from '../enum/AppSettings';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import getNameTranslation from '@/react/common/helpers/ServiceMap';

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
    let resolvedName = null;
    let ids = null;

    if (address) {
      let addresses = await getAddresses(getAddressUrls(address));
      addresses = addresses.filter((_address: any) => _address.results.length);

      if (addresses.length) {
        resolvedName = getNameTranslation(addresses[0].results[0].name, drupalSettings.path.currentLanguage);
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

    const result = await useTimeoutFetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(ids, coordinates, page, sv_only),
    });

    if (!result.ok) {
      throw new Error('Failed to fetch data.');
    }

    const json = await result.json();

    return {
      addressName: resolvedName,
      ...json
    };
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

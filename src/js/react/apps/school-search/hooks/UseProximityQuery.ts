import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import { getAddresses, getAddressUrls, getLocationsUrl, parseCoordinates } from '@/react/common/helpers/SubQueries';
import AppSettings from '../enum/AppSettings';
import getQueryString from '../helpers/ProximityQuery';
import { configurationsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type Result = {
  units?: number[];
};

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const { locationsBaseUrl } = AppSettings;
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async () => {
    const { index } = AppSettings;
    const { keyword } = params;

    let coordinates = null;
    let resolvedName = null;
    let ids = null;

    if (keyword) {
      let addresses = await getAddresses(getAddressUrls(keyword));
      addresses = addresses.filter((address) => address.results.length);

      if (addresses.length) {
        resolvedName = getNameTranslation(addresses[0].results[0].name, drupalSettings.path.currentLanguage);
        coordinates = parseCoordinates(addresses);
      }
    }

    if (keyword && !coordinates) {
      return null;
    }

    if (coordinates?.length) {
      const [lat, lon] = coordinates;
      const locationsResponse = await fetch(getLocationsUrl(locationsBaseUrl, lat, lon));
      const locationsData = await locationsResponse.json();

      if (!locationsData || !locationsData.results) {
        return null;
      }

      ids = locationsData.results.flatMap((result: Result) => result.units ?? []);
    }

    const result = await fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getQueryString(ids, coordinates, page),
    });

    if (!result.ok) {
      throw new Error('Failed to fetch proximity query');
    }

    const json = await result.json();

    return {
      addressName: resolvedName,
      ...json,
    };
  };

  const { data, error, isLoading, isValidating } = useSWR(
    baseUrl === '' ? null : `_${Object.values(params).toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
};

export default UseProximityQuery;

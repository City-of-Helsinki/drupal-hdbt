import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import getNameTranslation, { ServiceMapUnavailableError } from '@/react/common/helpers/ServiceMap';
import { getAddresses, getAddressUrls, getLocationsUrl, parseCoordinates } from '@/react/common/helpers/SubQueries';
import AppSettings from '../enum/AppSettings';
import getQueryString from '../helpers/ProximityQuery';
import { configurationsAtom } from '../store';
import type SearchParams from '../types/SearchParams';
import timeoutFetch from '@/react/common/helpers/TimeoutFetch';

type Result = { units?: number[] };

const UseProximityQuery = (params: SearchParams) => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const { locationsBaseUrl } = AppSettings;
  const page = Number.isNaN(Number(params.page)) ? 1 : Number(params.page);

  const fetcher = async () => {
    const { index } = AppSettings;
    const { home_address, sv_only } = params;

    let coordinates = null;
    let resolvedName = null;
    let ids = null;

    if (home_address) {
      let addresses: Awaited<ReturnType<typeof getAddresses>>;

      try {
        addresses = await getAddresses(getAddressUrls(home_address));
      } catch (e) {
        if (e instanceof ServiceMapUnavailableError) {
          return { addressError: 'unavailable' as const };
        }

        throw e;
      }

      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      addresses = addresses.filter((_address: any) => _address.results.length);

      if (addresses.length) {
        resolvedName = getNameTranslation(addresses[0].results[0].name, drupalSettings.path.currentLanguage);
        coordinates = parseCoordinates(addresses);
      }
    }

    if (home_address && !coordinates) {
      return { addressError: 'not-found' as const };
    }

    if (coordinates?.length) {
      const [lat, lon] = coordinates;
      const locationsResponse = await fetch(getLocationsUrl(locationsBaseUrl, lat, lon));
      const locationsData = await locationsResponse.json();

      if (!locationsData?.results) {
        return null;
      }

      ids = locationsData.results.flatMap((result: Result) => result.units ?? []);
    }

    const result = await timeoutFetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: getQueryString(ids, coordinates, page, sv_only),
    });

    if (!result.ok) {
      throw new Error('Failed to fetch proxomity data.');
    }

    const json = await result.json();

    return { addressName: resolvedName, ...json };
  };

  const queryString = `_${Object.values(params).toString()}`;
  const { data, error, isLoading, isValidating } = useSWR(queryString, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return { data, error, isLoading, isValidating, queryString };
};

export default UseProximityQuery;

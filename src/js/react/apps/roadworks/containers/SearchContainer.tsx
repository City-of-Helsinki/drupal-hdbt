import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';

import { useAtomCallback } from 'jotai/utils';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { coordinatesAtom, keywordAtom, roadworksApiUrlAtom, settingsAtom } from '../store';
import type Roadwork from '../types/Roadwork';
import ResultsContainer from './ResultsContainer';
import { FormContainer } from './FormContainer';
import useAddressToCoordsQuery from '@/react/common/hooks/useAddressToCoordsQuery';
import { GracefulError } from '../enum/GracefulError';

const SWR_REFRESH_OPTIONS = {
  refreshInterval: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  errorRetryCount: 3,
};

type ResponseType = {
  data: Roadwork[];
  meta: {
    count: number;
    error?: string;
    title?: string;
    see_all_url?: string;
  };
};

const SearchContainer: React.FC = () => {
  const [retriesExhausted, setRetriesExhausted] = useState(false);
  const url = useAtomValue(roadworksApiUrlAtom);
  const settings = useAtomValue(settingsAtom);
  const readKeyword = useAtomCallback((get) => get(keywordAtom));
  const setCoordinates = useSetAtom(coordinatesAtom);
  const readCoordinates = useAtomCallback((get) => get(coordinatesAtom));

  const getRoadworks = async (reqUrl: string): Promise<ResponseType|null> => {
    const currentCoordinates = readCoordinates();
    const keyword = readKeyword();

    if (!keyword || keyword === '') {
      return Promise.resolve(null);
    }

    const coordinates = currentCoordinates || await useAddressToCoordsQuery(keyword);

    if (!coordinates) {
      return Promise.resolve({
        data: [],
        meta: {
          count: 0,
          error: GracefulError.NO_COORDINATES,
        }
      });
    }

    if (!currentCoordinates) {
      setCoordinates(coordinates);
      const newUrl = new URL(reqUrl);
      const [lon, lat] = coordinates;
      newUrl.searchParams.set('lat', lat.toString());
      newUrl.searchParams.set('lon', lon.toString());
      reqUrl = newUrl.toString();
    }

    const response = await useTimeoutFetch(reqUrl, undefined, 12000);

    if (response.status === 200) {
      const result = await response.json();

      if (result.meta && result.meta.count >= 0) {
        return result;
      }
    }

    throw new Error('Failed to get roadworks data from the API');
  };

  const shouldFetch = url && url.length > 0;
  const { data, error, isLoading } = useSWR(shouldFetch ? url : null, getRoadworks, {
    ...SWR_REFRESH_OPTIONS,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (revalidateOpts.retryCount >= SWR_REFRESH_OPTIONS.errorRetryCount) {
        setRetriesExhausted(true);
        return;
      }

      revalidate({
        ...revalidateOpts
      });
    },
    keepPreviousData: true
  });

  return (
    <>
      {!settings.isShortList && <FormContainer />}
      <ResultsContainer
        countNumber={data?.meta.count || 0}
        error={error}
        gracefulError={data?.meta?.error}
        loading={isLoading}
        retriesExhausted={retriesExhausted}
        roadworks={data?.data || []}
        seeAllUrl={data?.meta.see_all_url}
        size={settings.roadworkCount ?? 10}
      />
    </>
  );
};

export default SearchContainer;

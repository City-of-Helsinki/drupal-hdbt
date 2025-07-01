import React, { createRef, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import { useTimeoutFetch } from '@/react/common/hooks/useTimeoutFetch';
import RoadworkCard from '../components/RoadworkCard';
import { roadworksApiUrlAtom } from '../store';
import type Roadwork from '../types/Roadwork';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';

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
    title?: string;
    see_all_url?: string;
  };
};

type ResultsContainerProps = {
  countNumber: number;
  error?: Error;
  roadworks: Roadwork[];
  loading: boolean;
  retriesExhausted?: boolean;
  seeAllUrl?: string;
};

function ResultsContainer({
  countNumber,
  error,
  roadworks,
  loading,
  retriesExhausted,
  seeAllUrl
}: ResultsContainerProps) {
  const scrollTarget = createRef<HTMLDivElement>();
  const size = 3; // Default roadwork count
  const count = countNumber;
  
  if (error || retriesExhausted) {
    return (
      <ResultsError
        error={error}
        retriesExhausted={retriesExhausted}
        wrapperClass='roadwork-list__error'
        ref={scrollTarget}
      />
    );
  }

  const getContent = () => {
    if (loading && !roadworks.length) {
      return <GhostList bordered={false} count={size} />;
    }
    
    if (roadworks.length > 0) {
      return (
        <>
          <ResultsHeader
            resultText={
              <>
                {Drupal.formatPlural(count, '1 result', '@count results', {}, {context: 'Roadworks search: result count'})}
              </>
            }
            ref={scrollTarget}
          />
          {loading ?
            <GhostList bordered={false} count={size} /> :
            roadworks.map(roadwork => <RoadworkCard key={roadwork.id} roadwork={roadwork} />)
          }
        </>
      );
    }

    return <ResultsEmpty wrapperClass='roadwork-list__no-results' ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      {
        seeAllUrl ?
        <div className='roadwork-list__see-all-button roadwork-list__see-all-button--near-you'>
          <a
            data-hds-component="button"
            href={seeAllUrl}
          >
            {Drupal.t('See all roadworks near you', {}, { context: 'Helsinki near you roadworks search' })}
          </a>
        </div> : null
      }
    </div>
  );
}

const SearchContainer: React.FC = () => {
  const [retriesExhausted, setRetriesExhausted] = useState(false);
  const roadworksApiUrl = useAtomValue(roadworksApiUrlAtom);
  const [initialized, setInitialized] = useState(false);

  console.log('🚀 SearchContainer render:', { roadworksApiUrl });
  console.log('🌍 drupalSettings check:', drupalSettings);
  console.log('🗺️ Roadworks settings:', (drupalSettings as any).helfi_roadworks);

  const getRoadworks = async (reqUrl: string): Promise<ResponseType | null> => {
    console.log('📡 Making API call to:', reqUrl);
    
    try {
      const response = await useTimeoutFetch(reqUrl, undefined, 10000);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (response.status === 200) {
        const result = await response.json();
        console.log('✅ API response:', result);
        console.log('🔍 Response structure check:', {
          hasData: !!result.data,
          hasMeta: !!result.meta,
          metaCount: result.meta?.count,
          dataLength: result.data?.length
        });

        if (result.meta && result.meta.count >= 0) {
          return result;
        } else {
          console.error('❌ Response structure invalid:', {
            meta: result.meta,
            hasCount: result.meta && 'count' in result.meta
          });
        }
      } else {
        console.error('❌ Non-200 response:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Response body:', errorText);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }

    throw new Error('Failed to get roadworks data from the API');
  };

  const shouldFetch = roadworksApiUrl && roadworksApiUrl.length > 0;
  console.log('🔍 Should fetch?', { shouldFetch, roadworksApiUrl });
  
  const { data, error, isLoading } = useSWR(shouldFetch ? roadworksApiUrl : null, getRoadworks, {
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

  useEffect(() => {
    if (shouldFetch && !initialized) {
      setInitialized(true);
    }
  }, [shouldFetch, initialized]);

  return (
    <ResultsContainer
      countNumber={data?.meta.count || 0}
      error={error}
      roadworks={data?.data || []}
      loading={isLoading}
      retriesExhausted={retriesExhausted}
      seeAllUrl={data?.meta.see_all_url}
    />
  );
};

export default SearchContainer;

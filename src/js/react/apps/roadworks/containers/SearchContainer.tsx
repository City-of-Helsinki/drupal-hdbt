import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Notification } from 'hds-react';
import { LoadingSpinner } from 'hds-react';
import useSWR from 'swr';
import { roadworksApiUrlAtom } from '../store';
import RoadworkCard from '../components/RoadworkCard';
import type Roadwork from '../types/Roadwork';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

type ResponseType = {
  data: Roadwork[];
  meta: {
    count: number;
    title?: string;
    see_all_url?: string;
    error?: string;
  }
};

const SWR_REFRESH_OPTIONS = {
  errorRetryCount: 3,
  revalidateOnMount: true,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 600000, // 10 minutes in millis
};

const SearchContainer: React.FC = () => {
  const roadworksApiUrl = useAtomValue(roadworksApiUrlAtom);
  const [retriesExhausted, setRetriesExhausted] = useState(false);

  console.log('🚀 SearchContainer render:', {
    roadworksApiUrl,
  });
  
  console.log('🌍 drupalSettings check:', window.drupalSettings);
  console.log('🗺️ Roadworks settings:', (window as any).drupalSettings?.helfi_roadworks);

  const getRoadworks = async (reqUrl: string): Promise<ResponseType | null> => {
    console.log('📡 Making API call to:', reqUrl);
    
    try {
      // Use regular fetch temporarily to debug
      const response = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', response.headers);
      
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
      setTimeout(() => revalidate({ retryCount: revalidateOpts.retryCount }), 5000);
    },
  });

  if (isLoading) {
    return (
      <div className="roadworks-loading">
        <LoadingSpinner />
        <span>Ladataan katutöitä...</span>
      </div>
    );
  }

  if (error || retriesExhausted) {
    return (
      <Notification
        type="error"
        label="Virhe"
        className="roadworks-error"
      >
        {error?.message || 'Katutöiden haku epäonnistui. Yritä uudelleen.'}
      </Notification>
    );
  }

  if (!shouldFetch) {
    return (
      <Notification
        type="info"
        label="Huomio"
        className="roadworks-no-coordinates"
      >
        Sijaintitietoja ei saatavilla. Katutöitä ei voida näyttää.
      </Notification>
    );
  }

  const roadworks = data?.data || [];

  if (roadworks.length === 0) {
    return (
      <Notification
        type="info"
        label="Ei tuloksia"
        className="roadworks-empty"
      >
        Ei katutöitä lähistöllä.
      </Notification>
    );
  }

  return (
    <div className="roadworks-search-container">
      <div className="roadworks-list">
        {roadworks.map((roadwork: Roadwork) => (
          <RoadworkCard key={roadwork.id} roadwork={roadwork} />
        ))}
      </div>
    </div>
  );
};

export default SearchContainer;

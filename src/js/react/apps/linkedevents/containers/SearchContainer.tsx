import { useEffect, useState } from 'react';
import useSWR from 'swr';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import type Event from '../types/Event';
import { QueryBuilder } from '../utils/QueryBuilder';
import type FilterSettings from '../types/FilterSettings';
import type Location from '../types/Location';

type ResponseType = {
  data: Event[];
  meta: {
    count: number;
    next?: string;
    previous?: string;
  }
};

const getEvents = async (url: string): Promise<ResponseType | null> => {
  const response = await fetch(url);

  if (response.status === 200) {
    const result = await response.json();

    if (result.meta && result.meta.count >= 0) {
      return result;
    }
  }

  throw new Error('Failed to get data from the API');
};

const transformLocations = (data: any, currentLanguage: string): Location[] => {
  const usedIds: string[] = [];
  const locations = data?.reduce((prev: any, current: any) => {
    if (current.location && current.location.id && (usedIds.indexOf(current.location.id) < 0) && current.location.name && current.location.name[currentLanguage]) {
      usedIds.push(current.location.id);
      return [...prev, { value: current.location.id, label: current.location.name[currentLanguage] }];
    }
    return prev;
  }, []);
  return locations;
};

const SWR_REFRESH_OPTIONS = {
  errorRetryCount: 3,
  revalidateOnMount: true,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 6000000, // 10 minutes,in millis
};

function SearchContainer({ filterSettings, queryBuilder }:{
  filterSettings: FilterSettings,
  queryBuilder: QueryBuilder
}) {
  const [locationOptions, setLocations ] = useState<Location[]>([]);
  const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);
  const [queryUrl, setQueryUrl] = useState<string>(queryBuilder.allEventsQuery());
  const { data, error } = useSWR(queryUrl, getEvents, SWR_REFRESH_OPTIONS);
  const loading = !error && !data;
  const submit = () => setQueryUrl(queryBuilder.getUrl());
  const { currentLanguage } = drupalSettings.path;

  useEffect(()=>{
    if (data && !locationsLoaded) {
      setLocations(transformLocations(data?.data, currentLanguage));
      setLocationsLoaded(true);
    }
  }, [data, locationsLoaded, currentLanguage]);

  console.log(data);

  return (
    <div className='component--event-list'>
      {Object.values(filterSettings).includes(true) &&
        <FormContainer filterSettings={filterSettings} queryBuilder={queryBuilder} onSubmit={submit} loading={loading} locationOptions={locationOptions} />
      }
      <ResultsContainer error={error} count={data?.meta.count || 0} loading={loading} events={data?.data || []} />
    </div>
  );
}

export default SearchContainer;

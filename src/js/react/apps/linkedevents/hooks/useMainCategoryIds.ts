import useSWR from 'swr';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import type { Event } from '../types/Event';

const EMPTY_SET: ReadonlySet<string> = new Set();

type KeywordSetResponse = { keywords?: Array<{ id: string }> };

const fetchKeywordSetIds = async (url: string): Promise<ReadonlySet<string>> => {
  const response = await useTimeoutFetch(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch keyword set: ${response.status}`);
  }

  const body: KeywordSetResponse = await response.json();

  return new Set((body.keywords ?? []).map((keyword) => keyword.id));
};

/**
 * Returns ids of "main category" keywords for the given event type.
 */
export const useMainCategoryIds = (typeId?: Event['type_id']): ReadonlySet<string> => {
  const url = typeId ? LinkedEvents.MAIN_CATEGORY_URLS[typeId] : undefined;

  // SWR dedupes requests by url.
  const { data } = useSWR(url ?? null, fetchKeywordSetIds, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  return data ?? EMPTY_SET;
};

export default useMainCategoryIds;

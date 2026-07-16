import { useEffect, useRef } from 'react';

// Focus/scroll behaviour shared by search results lists (keepPreviousData: true).
// - Initial page load: no focus, no scroll.
// - New search / pager click: ghost cards "Searching for results..." heading focus, scroll to the heading.
// - Results arrive after ghost cards: focus to results heading, no scroll.
// - Resubmitting an unchanged query (hit from cache, no ghosts): focus and scroll to results heading.
const useSearchFocusManagement = <Trigger>(
  isValidating: boolean,
  queryString: string,
  // biome-ignore lint/suspicious/noExplicitAny: data shape varies per search
  data: any,
  error: unknown,
  trigger: Trigger,
  // Set to false when the component has no automatic initial fetch (for example the
  // AI assisted site-search).
  suppressInitialLoad = true,
) => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const loadingHeaderRef = useRef<HTMLHeadingElement>(null);
  const lastDataKeyRef = useRef<string | null>(null);
  const wasSearchingRef = useRef(false);
  const skipResultsFocusRef = useRef(false);
  const initialLoadDoneRef = useRef(!suppressInitialLoad);
  const hadGhostCardsRef = useRef(false);
  // biome-ignore lint/suspicious/noExplicitAny: data shape varies per search
  const lastKeyDataRef = useRef<any>(undefined);

  // Only show ghost cards when the result is not served from cache. A cached result updates
  // data immediately, so the data changes at the same time as the search key.
  // A real fetch keeps the old data unchanged until the response arrives.
  const isLoadingNewSearch = isValidating && queryString !== lastDataKeyRef.current && data === lastKeyDataRef.current;
  const isSearching = (isValidating && data === undefined && !error) || isLoadingNewSearch;

  // When ghost cards appear (not initial load):
  // scroll to and focus the ghost heading, and mark that ghost cards were shown.
  useEffect(() => {
    if (!isSearching || !initialLoadDoneRef.current) return;
    hadGhostCardsRef.current = true;
    const node = loadingHeaderRef.current;
    if (node) {
      node.setAttribute('tabindex', '-1');
      node.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSearching]);

  // When a search completes (isValidating false → true → false cycle):
  // focus the results heading. Skip on initial page load. Skip scroll if ghost
  // cards already scrolled the top. Yield to useScrollToFirstItem for pager.
  // Also keeps lastDataKeyRef in sync for cache-hit detection below.
  useEffect(() => {
    if (isValidating) {
      if (initialLoadDoneRef.current) {
        wasSearchingRef.current = true;
      }
    } else {
      lastDataKeyRef.current = queryString;
      lastKeyDataRef.current = data;
      if (data !== undefined || error) {
        initialLoadDoneRef.current = true;
      }
      if (wasSearchingRef.current) {
        wasSearchingRef.current = false;
        if (skipResultsFocusRef.current) {
          skipResultsFocusRef.current = false;
          return;
        }
        const node = scrollTarget.current;
        if (node) {
          node.setAttribute('tabindex', '-1');
          node.focus({ preventScroll: true });
          if (!hadGhostCardsRef.current) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          hadGhostCardsRef.current = false;
        }
      }
    }
  }, [isValidating, queryString, error, data]);

  // When the user submits the same search again, the query hasn't changed so no
  // new network request is made and no ghost cards appear — focus the results
  // heading directly instead.
  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger is intentionally used only to detect resubmits
  useEffect(() => {
    if (!initialLoadDoneRef.current || queryString !== lastDataKeyRef.current || data === undefined) return;
    if (skipResultsFocusRef.current) {
      skipResultsFocusRef.current = false;
      return;
    }
    const node = scrollTarget.current;
    if (node) {
      node.setAttribute('tabindex', '-1');
      node.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [trigger]);

  return { scrollTarget, loadingHeaderRef, skipResultsFocusRef, isSearching };
};

export default useSearchFocusManagement;

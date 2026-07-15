import { useEffect, useRef } from 'react';

// Focus/scroll behaviour shared by SWR-backed search results lists (keepPreviousData: true).
// - Initial page load: no focus, no scroll.
// - New search / pager click: ghost cards get focus + scroll to the "searching" heading.
// - Results arrive after ghost cards: focus results heading, no scroll (already there).
// - Resubmitting an unchanged query (SWR cache hit, no ghost): focus + scroll to results heading.
const useSearchFocusManagement = <Trigger>(
  isValidating: boolean,
  queryString: string,
  // biome-ignore lint/suspicious/noExplicitAny: data shape varies per search
  data: any,
  error: unknown,
  trigger: Trigger,
) => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const loadingHeaderRef = useRef<HTMLHeadingElement>(null);
  const lastDataKeyRef = useRef<string | null>(null);
  const wasSearchingRef = useRef(false);
  const skipResultsFocusRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const hadGhostCardsRef = useRef(false);

  const isLoadingNewSearch = isValidating && queryString !== lastDataKeyRef.current;
  const isSearching = (data === undefined && !error) || isLoadingNewSearch;

  // When ghost cards appear (user-initiated, not initial load):
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
  // cards already scrolled the page. Yield to useScrollToFirstItem for pager.
  // Also keeps lastDataKeyRef in sync for cache-hit detection below.
  useEffect(() => {
    if (isValidating) {
      if (initialLoadDoneRef.current) {
        wasSearchingRef.current = true;
      }
    } else {
      lastDataKeyRef.current = queryString;
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

  // `trigger` is whatever atom-backed value gets a new reference on every form
  // submit, even when its values are unchanged. When queryString matches
  // lastDataKeyRef the query itself is unchanged and SWR will not revalidate —
  // focus the results heading directly in that case.
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

import { useCallback, useEffect, useRef } from 'react';

// Don't steal focus/scroll while a date range (or other) filter dialog is open.
// Note: HDS Select/Combobox keeps role="dialog" in the DOM always (toggled via CSS
// class), so we match the Collapsible-specific class instead.
const isFilterDialogOpen = () => Boolean(document.querySelector('.collapsible__children[role="dialog"]'));

const shouldSkipFocus = () => isFilterDialogOpen();

// Move focus (and optionally scroll) to a results/ghost heading.
const focusHeading = (node: HTMLElement | null, scroll: boolean) => {
  if (!node) {
    return;
  }
  node.setAttribute('tabindex', '-1');
  node.focus({ preventScroll: true });
  if (scroll) {
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Focus/scroll behaviour shared by search results lists (keepPreviousData: true).
// - Initial page load: no focus, no scroll.
// - New search / pager click: ghost cards "Searching for results..." heading focus, scroll to the heading.
// - Results arrive after ghost cards: focus to results heading, no scroll.
// - Resubmitting an unchanged query (hit from cache, no ghosts): focus and scroll to results heading.
// - Pager click: the first result of the requested page takes focus instead of the
//   results heading. Put resultsListRef on the result list and call onPageChange
//   from the pager handler.
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
  const resultsListRef = useRef<HTMLDivElement>(null);
  const lastDataKeyRef = useRef<string | null>(null);
  const wasSearchingRef = useRef(false);
  const skipResultsFocusRef = useRef(false);
  const pagerFocusPendingRef = useRef(false);
  const initialLoadDoneRef = useRef(!suppressInitialLoad);
  const hadGhostCardsRef = useRef(false);
  // Track suppression to prevent early focus hijack.
  const triggerFiredOnceRef = useRef(!suppressInitialLoad);
  // biome-ignore lint/suspicious/noExplicitAny: data shape varies per search
  const lastKeyDataRef = useRef<any>(undefined);

  const onPageChange = useCallback(() => {
    pagerFocusPendingRef.current = true;
    skipResultsFocusRef.current = true;
  }, []);

  const triggerFocus = useCallback((callable: () => void) => {
    if (shouldSkipFocus()) {
      return;
    }

    callable();
  }, []);

  // Only show ghost cards when the result is not served from cache. A cached result updates
  // data immediately, so the data changes at the same time as the search key.
  // A real fetch keeps the old data unchanged until the response arrives.
  const isLoadingNewSearch = isValidating && queryString !== lastDataKeyRef.current && data === lastKeyDataRef.current;
  const isSearching = (isValidating && data === undefined && !error) || isLoadingNewSearch;

  // When ghost cards appear (not initial load):
  // scroll to and focus the ghost heading, and mark that ghost cards were shown.
  useEffect(() => {
    if (!isSearching || !initialLoadDoneRef.current) {
      return;
    }
    hadGhostCardsRef.current = true;
    triggerFocus(() => focusHeading(loadingHeaderRef.current, true));
  }, [isSearching, triggerFocus]);

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
        // Stay armed while a filter is open: the focus fires once it closes.
        if (shouldSkipFocus()) {
          return;
        }
        wasSearchingRef.current = false;
        if (skipResultsFocusRef.current) {
          skipResultsFocusRef.current = false;
          return;
        }
        focusHeading(scrollTarget.current, !hadGhostCardsRef.current);
        hadGhostCardsRef.current = false;
      }
    }
  }, [isValidating, queryString, error, data]);

  // When the user submits the same search again, the query hasn't changed so no
  // new network request is made and no ghost cards appear — focus the results
  // heading directly instead.
  // Skipped rather than deferred while a filter is open: this effect keys off the
  // trigger, so re-running it on close would focus after a plain open/close too.
  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger is intentionally used only to detect resubmits
  useEffect(() => {
    if (!triggerFiredOnceRef.current) {
      triggerFiredOnceRef.current = true;
      return;
    }
    if (!initialLoadDoneRef.current || queryString !== lastDataKeyRef.current || data === undefined) {
      return;
    }
    if (skipResultsFocusRef.current) {
      return;
    }
    triggerFocus(() => focusHeading(scrollTarget.current, true));
  }, [trigger]);

  useEffect(() => {
    if (!pagerFocusPendingRef.current || isValidating) {
      return;
    }

    const firstLink = resultsListRef.current?.querySelector<HTMLElement>('a');

    if (!firstLink) {
      return;
    }

    triggerFocus(() => {
      pagerFocusPendingRef.current = false;
      firstLink.focus({ preventScroll: true });
      firstLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  return { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching };
};

export default useSearchFocusManagement;

import { type RefObject, useEffect, useRef } from 'react';

const useScrollToFirstItem = (containerRef: RefObject<HTMLElement | null>, isLoading: boolean) => {
  const pending = useRef(false);

  useEffect(() => {
    if (!pending.current || isLoading) return;
    pending.current = false;
    const firstLink = containerRef.current?.querySelector<HTMLElement>('a');
    if (firstLink) {
      firstLink.focus({ preventScroll: true });
      firstLink.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, containerRef]);

  return () => {
    pending.current = true;
  };
};

export default useScrollToFirstItem;

import { RefObject, useEffect } from 'react';

const useScrollToResults = (ref: RefObject<HTMLElement>, shouldScrollOnRender: boolean) => {
  useEffect(() => {
    const { current } = ref;

    if (current && shouldScrollOnRender) {
      setTimeout(() => {
        current.setAttribute('tabindex', '-1');
        current.focus({ preventScroll: true });
        current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50); // UHF-10235 Small delay to fix screen reader focus issue on safari
    }
  }, [ref, shouldScrollOnRender]);
};

export default useScrollToResults;

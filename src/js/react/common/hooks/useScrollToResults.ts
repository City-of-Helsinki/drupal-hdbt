import { type RefObject, useEffect } from 'react';

const useScrollToResults = (
  ref: RefObject<HTMLElement>,
  shouldScrollOnRender: boolean,
) => {
  useEffect(() => {
    const { current } = ref;

    if (current && shouldScrollOnRender) {
      current.setAttribute('tabindex', '-1');
      current.focus({ preventScroll: true });
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ref, shouldScrollOnRender]);
};

export default useScrollToResults;

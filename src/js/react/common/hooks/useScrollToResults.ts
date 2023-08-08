import { RefObject, useEffect } from 'react';

const useScrollToResults = (ref: RefObject<HTMLElement>, shouldScrollOnRender: boolean, ) => {
  useEffect(() => {
    const { current } = ref;

    if (current && shouldScrollOnRender) {
      current.setAttribute('tabindex', '0');
      current.focus();
      current.scrollIntoView({behavior: 'smooth'});
    }
  }, [ref, shouldScrollOnRender]);
};

export default useScrollToResults;

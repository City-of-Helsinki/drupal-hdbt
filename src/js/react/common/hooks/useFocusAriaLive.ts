import { RefObject, useEffect } from 'react';

const useFocusAriaLive = (ref: RefObject<HTMLElement>, shouldAriaLiveOnRender: boolean) => {
  useEffect(() => {
    const { current } = ref;

    if (current && shouldAriaLiveOnRender) {
      current.setAttribute('aria-live', 'polite');
    }
  }, [ref, shouldAriaLiveOnRender]);
};

export default useFocusAriaLive;

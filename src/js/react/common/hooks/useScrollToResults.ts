import { type RefObject, useEffect } from 'react';

const useScrollToResults = (ref: RefObject<HTMLElement>, shouldScrollOnRender: boolean) => {
  useEffect(() => {
    const { current } = ref;

    if (current && shouldScrollOnRender) {
      // Don't steal focus when a date range filter dialog is open.
      // Note: HDS Select/Combobox keeps role="dialog" in the DOM always
      // (toggled via CSS class), so we must match the Collapsible-specific class instead.
      if (document.querySelector('.collapsible__children[role="dialog"]')) {
        return;
      }
      current.setAttribute('tabindex', '-1');
      current.focus({ preventScroll: true });
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [ref, shouldScrollOnRender]);
};

export default useScrollToResults;

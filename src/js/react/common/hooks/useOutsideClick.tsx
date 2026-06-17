import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';

// Make any element listen outside click and focus events.
// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
// biome-ignore lint/complexity/noBannedTypes: @todo UHF-12501
const useOutsideClick = (ref: MutableRefObject<any>, callback: Function) => {
  const isChild = useCallback((event) => ref.current?.contains(event.target as Node), [ref]);
  const mouseDownInside = useRef(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      mouseDownInside.current = ref.current?.contains(event.target as Node) ?? false;
    };

    const handleClick = (event: MouseEvent) => {
      if (!isChild(event)) {
        // Defer close so that floating elements opened by inner components like the HDS date
        // picker calendar can finish processing and return focus inside before closing the dialog.
        setTimeout(() => {
          if (ref.current && !ref.current.contains(document.activeElement)) {
            callback();
          }
        }, 0);
      }
    };

    const handleFocusin = (event: FocusEvent) => {
      // If a mousedown just happened inside, focus may have moved to a floating element
      // like the HDS date picker calendar — don't close in that case.
      if (!isChild(event) && !mouseDownInside.current) {
        // If focus returns inside, like after the calendar closes we skip it.
        setTimeout(() => {
          if (ref.current && !ref.current.contains(document.activeElement)) {
            callback();
          }
        }, 0);
      }
      mouseDownInside.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('click', handleClick);
    document.addEventListener('focusin', handleFocusin);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('focusin', handleFocusin);
    };
  });
};

export default useOutsideClick;

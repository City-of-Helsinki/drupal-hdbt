import { MutableRefObject, useEffect } from 'react';

// Make any element listen outside click and focus events.
const useOutsideClick = (ref: MutableRefObject<any>, callback: Function) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent | FocusEvent) => {
      // Is the click or focus outside this component
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('focusin', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('focusin', handleClick);
    };
  });
};

export default useOutsideClick;

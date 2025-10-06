import { MutableRefObject, useCallback, useEffect } from 'react';

// Make any element listen outside click and focus events.
const useOutsideClick = (ref: MutableRefObject<any>, callback: Function) => {
  const isChild = useCallback((event) => ref.current && ref.current.contains(event.target as Node));

  useEffect(() => {
    const handleClick = (event: MouseEvent | FocusEvent) => {
      // Is the click or focus outside this component
      if (!isChild(event)) {
        event.stopPropagation();
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

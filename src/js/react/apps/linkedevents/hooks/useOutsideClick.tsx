import { MutableRefObject, useEffect } from 'react';

// Make any element listen ourside clicks
const useOutsideClick = (ref: MutableRefObject<any>, callback: Function) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Is the click outside this component
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export default useOutsideClick;

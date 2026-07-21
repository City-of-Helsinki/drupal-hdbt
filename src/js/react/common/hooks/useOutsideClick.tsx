import { type RefObject, useEffect } from 'react';

// Make any element listen for pointer and focus events that land outside it.
const useOutsideClick = <T extends Node>(ref: RefObject<T | null>, callback: () => void) => {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        callback();
      }
    };

    // Handle keyboard navigation (e.g. tabbing out)
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && ref.current?.contains(event.target as Node) && !ref.current.contains(next)) {
        callback();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('focusout', handleFocusOut);
    };
  });
};

export default useOutsideClick;

import { useRef } from 'react';

export const useAddressSearchForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' &&
        target.getAttribute('aria-activedescendant') === null &&
        target.getAttribute('role') === 'combobox'
      ) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
  };
  const handleAddressSubmit = (address: string, setKeyword: (address: string) => void) => {
    // Palvelukarttaa address search only allows specific characters.
    setKeyword(address.replace(/[^a-zA-Z0-9.,+&'|+\-\s]*/g, ''));
  };
  return {
    formRef,
    handleKeyDown,
    handleAddressSubmit,
  };
};

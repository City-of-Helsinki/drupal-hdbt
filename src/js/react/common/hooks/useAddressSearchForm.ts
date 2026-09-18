import { useRef } from 'react';
import { sanitizeAddress } from '../helpers/ServiceMap';

export const useAddressSearchForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' &&
        target.getAttribute('role') === 'combobox' &&
        target.getAttribute('aria-expanded') !== 'true'
      ) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
  };
  const handleAddressSubmit = (address: string, setKeyword: (address: string) => void) => {
    // Palvelukarttaa address search only allows specific characters.
    setKeyword(sanitizeAddress(address));
  };
  return {
    formRef,
    handleKeyDown,
    handleAddressSubmit,
  };
};

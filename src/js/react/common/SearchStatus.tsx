import { useEffect, useRef, useState } from 'react';

type SearchStatusProps = {
  announce: boolean;
  isValidating: boolean;
  text: string;
};

const SearchStatus = ({ announce, isValidating, text }: SearchStatusProps) => {
  const [announcement, setAnnouncement] = useState('');
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    if (isValidating) {
      return;
    }

    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      return;
    }

    if (!announce) {
      return;
    }

    setAnnouncement(text);
  }, [announce, isValidating, text]);

  return (
    <output aria-live='polite' className='visually-hidden'>
      {announcement}
    </output>
  );
};

export default SearchStatus;

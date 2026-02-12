import { SearchInput } from 'hds-react';
import { useAtomValue } from 'jotai';
import { keywordAtom } from '../containers/store';
import useSWR from 'swr';

export const SearchBar = () => {
  const keyword = useAtomValue(keywordAtom);
 
  const { data, error } = useSWR(
    keyword?.length ? `/api/search?keyword=${encodeURIComponent(keyword)}` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch search suggestions');
      }
      return res.json();
    },
  )

  const getSuggestions = () => {
    if (error) {
      return [];
    }

    return data || [];
  };

  const handleSubmit = (value: string) => {
    console.log('Search submitted with value:', value);
  }

  return (
    <SearchInput
      clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'Cross-institutional studies: search input clear button aria label' })}
      getSuggestions={getSuggestions}
      label={Drupal.t('Search word', {}, { context: 'Cross-institutional studies: search input label' })}
      onSubmit={handleSubmit}
      placeholder={Drupal.t('E.g. biology', {}, { context: 'Cross-institutional studies: search input placeholder' })}
      searchButtonAriaLabel={Drupal.t('Search', {}, { context: 'Cross-institutional studies: search button aria label' })}
      suggestionLabelField='value'
    />
  );
}

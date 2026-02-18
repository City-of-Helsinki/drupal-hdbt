import { SearchInput } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { keywordAtom } from '../store';
import useSWR from 'swr';
import { loadableInitialUrlAtom, updateParamsAtom, updateUrlAtom } from '../../../store';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import ApiKeys from '../../../enum/ApiKeys';
import type Event from '../../../types/Event';

export const SearchBar = () => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [urlData] = useAtom(loadableInitialUrlAtom);
  const updateUrl = useSetAtom(updateUrlAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const { currentLanguage } = drupalSettings.path;

  const getRequestUrl = () => {
    if (urlData.state !== 'hasData') {
      return null;
    }
    const url = new URL(urlData.data);
    url.searchParams.set(ApiKeys.COMBINED_TEXT, keyword);
    return url.toString();
  };

  const { data, error } = useSWR(
    keyword?.length ? getRequestUrl() : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch search suggestions');
      }
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const getSuggestions = async () => {
    if (error || !data) {
      return [];
    }

    return data.data.map((item: Event) => ({ value: getNameTranslation(item.name, currentLanguage)?.trim() })) || [];
  };

  const handleChange = (value: string) => {
    updateParams({
      [ApiKeys.COMBINED_TEXT]: value,
    });
    setKeyword(value);
  };

  const handleSubmit = (value: string) => {
    handleChange(value);
    updateUrl();
  };

  return (
    <SearchInput
      className='hdbt-search__filter'
      clearButtonAriaLabel={Drupal.t(
        'Clear',
        {},
        { context: 'Cross-institutional studies: search input clear button aria label' },
      )}
      getSuggestions={getSuggestions}
      label={Drupal.t('Search word', {}, { context: 'Cross-institutional studies: search input label' })}
      onChange={handleChange}
      onSubmit={handleSubmit}
      placeholder={Drupal.t('E.g. biology', {}, { context: 'Cross-institutional studies: search input placeholder' })}
      searchButtonAriaLabel={Drupal.t(
        'Search',
        {},
        { context: 'Cross-institutional studies: search button aria label' },
      )}
      suggestionLabelField='value'
      value={keyword || ''}
    />
  );
};

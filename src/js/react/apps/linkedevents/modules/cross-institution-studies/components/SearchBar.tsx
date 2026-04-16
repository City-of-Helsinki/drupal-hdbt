import { Search } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { keywordAtom } from '../store';
import useSWR from 'swr';
import { loadableInitialUrlAtom, updateParamsAtom, updateUrlAtom } from '../../../store';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import ApiKeys from '../../../enum/ApiKeys';
import type Event from '../../../types/Event';
import { useCallback, useState } from 'react';

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

  const handleChange = useCallback(
    (value: string) => {
      updateParams({
        [ApiKeys.COMBINED_TEXT]: value,
      });
      setKeyword(value);
    },
    [setKeyword, updateParams],
  );

  const handleSend = useCallback(
    (value: string) => {
      handleChange(value);
      updateUrl();
    },
    [handleChange, updateUrl],
  );

  const [props] = useState({
    className: 'hdbt-search__filter hdbt-search__search-input',
    hideSubmitButton: true,
    texts: {
      label: Drupal.t('Search word', {}, { context: 'Cross-institutional studies: search input label' }),
      searchPlaceholder: Drupal.t(
        'E.g. biology',
        {},
        { context: 'Cross-institutional studies: search input placeholder' },
      ),
      searchButtonAriaLabel: Drupal.t('Search', {}, { context: 'React search: submit button label' }),
    },
  });

  const handleSearch = useCallback(async () => {
    if (error || !data) {
      return { options: [] };
    }
    const options = data.data.map((item: Event) => {
      const label = getNameTranslation(item.name, currentLanguage)?.trim() || '';
      return { label, value: label };
    });
    return { options };
  }, [data, error, currentLanguage]);

  return (
    <Search
      {...props}
      onSearch={handleSearch}
      onChange={(e) => handleChange(e.target.value)}
      onSend={handleSend}
      value={keyword || ''}
    />
  );
};

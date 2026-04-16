import { Search } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import ApiKeys from '../../../enum/ApiKeys';
import { loadableInitialUrlAtom, updateParamsAtom, updateUrlAtom } from '../../../store';
import type Event from '../../../types/Event';
import { keywordAtom } from '../store';

export const SearchBar = () => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [urlData] = useAtom(loadableInitialUrlAtom);
  const updateUrl = useSetAtom(updateUrlAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const { currentLanguage } = drupalSettings.path;

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

  const handleSearch = useCallback(
    async (value: string) => {
      if (!value?.length || urlData.state !== 'hasData') {
        return { options: [] };
      }
      try {
        const url = new URL(urlData.data);
        url.searchParams.set(ApiKeys.COMBINED_TEXT, value);
        const res = await fetch(url.toString());
        if (!res.ok) {
          return { options: [] };
        }
        const data = await res.json();
        const options = data.data.map((item: Event) => {
          const label = getNameTranslation(item.name, currentLanguage)?.trim() || '';
          return { label, value: label };
        });
        return { options };
      } catch {
        return { options: [] };
      }
    },
    [urlData, currentLanguage],
  );

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

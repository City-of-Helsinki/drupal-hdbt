import { Search } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import Global from '../enum/Global';
import SearchComponents from '../enum/SearchComponents';
import { getElasticUrlAtom, getKeywordAtom, setStateValueAtom } from '../store';

export const SearchBar = () => {
  const keyword = useAtomValue(getKeywordAtom);
  const setStateValue = useSetAtom(setStateValueAtom);

  const elasticUrl = useAtomValue(getElasticUrlAtom);
  const { index } = Global;
  const url = `${elasticUrl}/${index}/_search`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue({ key: SearchComponents.KEYWORD, value: event.target.value.replace(/\s+/g, ' ') });
  };

  const getSuggestions = useCallback(async (): Promise<{ options: { label: string; value: string }[] }> => {
    const query = {
      _source: ['title'],
      fields: ['title'],
      size: 20,
      query: {
        prefix: {
          'title.keyword': {
            value: keyword,
            case_insensitive: true,
          },
        },
      },
    };

    let data = [];
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      data = await response.json();
    } catch (_e) {
      return data;
    }
    let results = data?.hits?.hits ?? [];

    // Split all titles by comma and take the first part.
    results = results
      .map((item: { fields: { title: string[] } }): string => item.fields.title[0])
      .map((item_1: string): string => item_1.split(',')[0]);

    // Remove duplicates.
    results = Array.from(new Set(results));
    // Only 5 values.
    results = results.length > 5 ? results.splice(0, 5) : results;
    // Turn the title in format accepted by search component.
    results = results.map((suggestion: string) => {
      return {
        something: suggestion,
        value: suggestion,
      };
    });

    return { options: results };
  }, [keyword, url]);

  const [props] = useState({
    id: SearchComponents.KEYWORD,
    className: 'hdbt-search__filter hdbt-search__search-input job-search-form__filter',
    texts: {
      label: Drupal.t('Search term', {}, { context: 'Search keyword label' }),
      name: SearchComponents.KEYWORD,
      language: window.drupalSettings?.path?.currentLanguage || 'fi',
      searchPlaceholder: Drupal.t(
        'Eg. title, location, department',
        {},
        { context: 'HELfi Rekry job search keyword placeholder' },
      ),
      searchClearButtonAriaLabel: Drupal.t('Clear', {}, { context: 'React search' }),
    },
    style: defaultTextInputStyle,
    placeholder: Drupal.t(
      'Eg. title, location, department',
      {},
      { context: 'HELfi Rekry job search keyword placeholder' },
    ),
  });

  return (
    <Search
      {...props}
      hideSubmitButton={false}
      // type='search'
      // value={keyword}
      onChange={handleChange}
      onSearch={getSuggestions}
      // onSend={}
      visibleOptions={5}
    />
  );
};

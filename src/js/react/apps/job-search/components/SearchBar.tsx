import type { estypes } from '@elastic/elasticsearch';
import { Search, type SearchInputHandle } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import SearchComponents from '../enum/SearchComponents';
import { getElasticUrlAtom, getKeywordAtom, setStateValueAtom } from '../store';
import type Job from '../types/Job';

export const SearchBar = ({ formRef }: { formRef: React.RefObject<HTMLFormElement | null> }) => {
  const readInitialKeyword = useAtomCallback(useCallback((get) => get(getKeywordAtom), []));
  const ref = useRef<SearchInputHandle>(null);
  const setStateValue = useSetAtom(setStateValueAtom);
  const elasticUrl = useAtomValue(getElasticUrlAtom);
  const { index } = Global;
  const url = `${elasticUrl}/${index}/_search`;

  const handleChange = useCallback(
    (changedKeyword: string) => {
      setStateValue({ key: SearchComponents.KEYWORD, value: changedKeyword.replace(/\s+/g, ' ') });
    },
    [setStateValue],
  );

  const handleSubmit = useCallback(
    (value: string) => {
      setStateValue({ key: SearchComponents.KEYWORD, value: value.replace(/\s+/g, ' ') });
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    },
    [setStateValue, formRef],
  );

  const getSuggestions = useCallback(
    async (changedKeyword: string): Promise<{ options: { label: string; value: string }[] }> => {
      // Search logic from the actual search.
      const fields = [
        IndexFields.TITLE,
        IndexFields.ORGANIZATION,
        IndexFields.ORGANIZATION_NAME,
        IndexFields.EMPLOYMENT,
      ];
      // Escape Elasticsearch wildcard metacharacters so a literal '*' or '?'
      // in the keyword doesn't turn into a match-everything wildcard query.
      const wildcardKeyword = changedKeyword.replace(/[\\*?]/g, '\\$&');
      const query = {
        _source: fields,
        fields: fields,
        size: 20,
        query: {
          bool: {
            should: [
              {
                combined_fields: {
                  query: changedKeyword,
                  fields: [
                    `${IndexFields.TITLE}^2`,
                    `${IndexFields.ORGANIZATION}^1.5`,
                    IndexFields.ORGANIZATION_NAME,
                    IndexFields.EMPLOYMENT,
                  ],
                },
              },
              {
                wildcard: {
                  [`${IndexFields.TITLE}.keyword`]: `*${wildcardKeyword}*`,
                },
              },
              { wildcard: { [IndexFields.TITLE]: `*${wildcardKeyword}*` } },
            ],
          },
        },
      };

      let data: estypes.SearchResponse<Job>;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query),
        });
        data = await response.json();
      } catch (_e) {
        return { options: [] };
      }
      const hits = data?.hits?.hits ?? [];

      // Split all titles by comma and take the first part.
      const titles = hits
        .map((item): string | undefined => item.fields?.title?.[0])
        .filter((title): title is string => Boolean(title))
        .map((title): string => title.split(',')[0]);

      // Remove duplicates
      const options = Array.from(new Set(titles)).map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }));

      return { options };
    },
    [url],
  );

  const handleSearch = useCallback(
    (changedKeyword: string) => {
      return getSuggestions(changedKeyword);
    },
    [getSuggestions],
  );

  const [props] = useState({
    id: SearchComponents.KEYWORD,
    className: 'hdbt-search__filter hdbt-search__search-input job-search-form__filter',
    visibleOptions: 5,
    style: defaultTextInputStyle,
    placeholder: Drupal.t(
      'Eg. title, location, department',
      {},
      { context: 'HELfi Rekry job search keyword placeholder' },
    ),
    texts: {
      label: Drupal.t('Search term', {}, { context: 'Search keyword label' }),
      language: window.drupalSettings?.path?.currentLanguage || 'fi',
      searchPlaceholder: Drupal.t(
        'Eg. title, location, department',
        {},
        { context: 'HELfi Rekry job search keyword placeholder' },
      ),
      searchClearButtonAriaLabel: Drupal.t('Clear', {}, { context: 'React search' }),
    },
  });

  useEffect(() => {
    const initialKeyword = readInitialKeyword() ?? '';
    // On pageload, set the query parameter value to search input.
    if (ref.current) {
      ref.current.value = initialKeyword;
    }
    // Set the initial search keyword.
    handleChange(initialKeyword);
  }, [readInitialKeyword, handleChange]);

  return (
    <Search
      {...props}
      ref={ref}
      hideSubmitButton={true}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      onSearch={handleSearch}
      onSend={handleSubmit}
    />
  );
};

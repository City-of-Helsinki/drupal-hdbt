import { Button, Search } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import getSuggestionsQuery from '../helpers/GetSuggestionsQuery';
import configurationsAtom, { paramsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type SuggestionItemType = { value: string };

const FormContainer = ({ initialParams }: { initialParams?: SearchParams | null }) => {
  const setParams = useSetAtom(paramsAtom);
  const [address, setAddress] = useState(initialParams?.address || '');
  const { baseUrl, index } = useAtomValue(configurationsAtom);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: SearchParams = { address };
    setParams(params);
  };

  const getSuggestions = useCallback(
    (searchString: string): Promise<SuggestionItemType[]> =>
      fetch(`${baseUrl}/${index}/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: getSuggestionsQuery(searchString),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.error?.type === 'index_not_found_exception') {
            console.warn(
              `[Ploughing Schedule] Elasticsearch index "${index}" not found. ` + `Reason: ${data.error.reason}`,
            );
            return [];
          }

          const hits = data?.hits?.hits ?? [];
          // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
          const streetNames: SuggestionItemType[] = hits.map((hit: any) => ({ value: hit.fields.street_name[0] }));

          return streetNames.filter(
            (item, itemIndex, self) => itemIndex === self.findIndex((curr) => curr.value === item.value),
          );
        })
        .catch((error) => {
          console.warn('[Ploughing Schedule] Failed to fetch suggestions.', error);
          return [];
        }),
    [baseUrl, index],
  );

  const handleChange = useCallback((address: string) => {
    setAddress(address);
  }, []);

  const handleSearch = useCallback(
    (searchValue: string) => {
      return getSuggestions(searchValue).then((results) => ({
        options: results.map((r) => ({ label: r.value, value: r.value })),
      }));
    },
    [getSuggestions],
  );

  const handleSend = useCallback((value: string) => {
    setAddress(value);
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }, []);

  const [props] = useState({
    className: 'hdbt-search__filter hdbt-search__search-input',
    hideSubmitButton: true,
    texts: {
      label: Drupal.t('Street name', {}, { context: 'Ploughing schedule: Input label' }),
      language: window.drupalSettings?.path?.currentLanguage || 'fi',
      searchPlaceholder: Drupal.t(
        'For example, Mannerheimintie',
        {},
        { context: 'Ploughing schedule: Input placeholder' },
      ),
    },
    visibleOptions: 5,
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: We use form with role for now
    <form ref={formRef} className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <h2 className='hdbt-search--react__form-title'>
        {Drupal.t('See the ploughing schedule', {}, { context: 'Ploughing schedule: Form title / submit' })}
      </h2>
      <p className='hdbt-search--react__form-description'>
        {Drupal.t(
          "Enter the name of your street to see an estimate of the street's ploughing schedule.",
          {},
          { context: 'Ploughing schedule: Form description' },
        )}
      </p>
      <Search
        {...props}
        onSearch={handleSearch}
        onSend={handleSend}
        onChange={(e) => {
          if (!e.target.value && !e.nativeEvent) return;
          handleChange(e.target.value);
        }}
        value={address}
      />
      <Button
        className='hdbt-search--react__submit-button hdbt-search--ploughing-schedule__submit-button'
        type='submit'
      >
        {Drupal.t('See the ploughing schedule', {}, { context: 'Ploughing schedule: Form title / submit' })}
      </Button>
    </form>
  );
};

export default FormContainer;

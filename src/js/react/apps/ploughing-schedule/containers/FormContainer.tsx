import { Button, Search } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import getSuggestionsQuery from '../helpers/GetSuggestionsQuery';
import configurationsAtom, { paramsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type SuggestionItemType = { value: string };

const FormContainer = ({ initialParams }: { initialParams?: SearchParams | null }) => {
  const setParams = useSetAtom(paramsAtom);
  const [address, setAddress] = useState(initialParams?.address || '');
  const { baseUrl, index } = useAtomValue(configurationsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: SearchParams = { address };
    setParams(params);
  };

  const getSuggestions = (searchString: string): Promise<SuggestionItemType[]> =>
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
      });

  return (
    // biome-ignore lint/a11y/useSemanticElements: We use form with role for now
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
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
        className='hdbt-search__filter hdbt-search__search-input'
        hideSubmitButton
        onSearch={(searchValue) =>
          getSuggestions(searchValue).then((results) => ({
            options: results.map((r) => ({ label: r.value, value: r.value })),
          }))
        }
        onSend={(value) => setAddress(value)}
        onChange={(e) => setAddress(e.target.value)}
        visibleOptions={5}
        texts={{
          label: Drupal.t('Street name', {}, { context: 'Ploughing schedule: Input label' }),
          language: window.drupalSettings?.path?.currentLanguage || 'fi',
          searchPlaceholder: Drupal.t(
            'For example, Mannerheimintie',
            {},
            { context: 'Ploughing schedule: Input placeholder' },
          ),
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

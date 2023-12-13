import { Button, SearchInput } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';

import { useState } from 'react';
import configurationsAtom, { paramsAtom } from '../store';
import SearchParams from '../types/SearchParams';
import getSuggestionsQuery from '../helpers/GetSuggestionsQuery';

type SuggestionItemType = {
  value: string;
};

const FormContainer = () => {
  const setParams = useSetAtom(paramsAtom);
  const [keyword, setKeyword] = useState('');
  const { baseUrl, index } = useAtomValue(configurationsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: SearchParams = {};
    params.keyword = keyword;
    setParams(params);
  };

  const getSuggestions = (searchString: string) => new Promise<SuggestionItemType[]>((resolve, reject) => {
    const suggestions = fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: getSuggestionsQuery(searchString),
    })
    .then(res => res.json())
    .then(data => {
      let streetNames: any[] = [];
      streetNames = data?.hits?.hits.map((hit: any) => {
        const streetName = hit.fields.street_name[0];
        return {value: streetName};
      });

      // Remove street name duplicates.
      return streetNames.filter((item, indx, self) =>
        indx === self.findIndex((curr) => curr.value === item.value)
      );
    });

    resolve(suggestions);    
  });

  return (
    <form className='hdbt-search--react__form-container' onSubmit={onSubmit}>
      <h2 className='hdbt-search--react__form-title'>
        {Drupal.t('See the ploughing schedule', {}, {context: 'Ploughing schedule: Form title'})}
      </h2>
      <p className='hdbt-search--react__form-description'>
        {Drupal.t(
          'Enter the name of your street to see an estimate of the street\'s ploughing schedule.',
          {},
          {context: 'Ploughing schedule: Form description'}
        )}
      </p>
      <SearchInput 
        className='hdbt-search__filter'
        hideSearchButton
        label={Drupal.t('Street name', {}, {context: 'Ploughing schedule: Input label'})}
        suggestionLabelField='value'
        getSuggestions={getSuggestions}
        onSubmit={value => setKeyword(value)}
        visibleSuggestions={5}
        placeholder={Drupal.t('For example, Mannerheimintie', {}, {context: 'Ploughing schedule: Input placeholder'})}
      />
      <Button className='hdbt-search--react__submit-button' type='submit' style={{marginBlock: 0}}>
        {Drupal.t('See the ploughing schedule', {}, {context: 'Ploughing schedule: Form submit'})}
      </Button>
    </form>
  );
};

export default FormContainer;

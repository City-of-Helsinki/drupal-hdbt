import { Button } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';

import { AddressSearch } from '@/react/common/AddressSearch';
import { keywordAtom, paramsAtom } from '../store';
import SearchParams from '../types/SearchParams';

const ProximityFormContainer = ({ initialAddress }: { initialAddress?: string}) => {
  const setParams = useSetAtom(paramsAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: SearchParams = {};

    if (keyword && keyword.length) {
      params.keyword = keyword;
    }

    setParams(params);
    // Trigger scroll to results even if the form is submitted empty.
    sessionStorage.setItem('scrollToResults', 'true');
  };

  return (
    <form
      className='hdbt-search--react__form-container'
      onSubmit={onSubmit}
      role='search'
    >
      <h3>
        {Drupal.t('Search for your local school', {}, {context: 'School search: local search title'})}
      </h3>
      <p className='hdbt-search--react__form-description'>
        {Drupal.t(
          'Your child\'s primary comprehensive school, i.e., the local school, is assigned based on the child\'s home address. You can search for Finnish- and Swedish-language comprehensive schools.',
          {},
          {context: 'School search: local search description'}
        )}
      </p>
      <AddressSearch
        className='hdbt-search__filter'
        clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search'})}
        helperText={Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper'})}
        id='keyword'
        label={Drupal.t('The child\'s home address', {}, { context: 'School search: input label'})}
        onChange={(value: string) => setKeyword(value)}
        onSubmit={(value: string) => setKeyword(value)}
        visibleSuggestions={5}
        value={keyword}
      />
      <Button className='hdbt-search--react__submit-button' type='submit'>{Drupal.t('Search', {}, { context: 'React search: submit button label'})}</Button>
    </form>
  );
};

export default ProximityFormContainer;

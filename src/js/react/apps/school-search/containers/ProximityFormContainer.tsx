import { Button } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';

import { keywordAtom, paramsAtom } from '../store';
import { AddressSearch } from '@/react/common/AddressSearch';
import SearchParams from '../types/SearchParams';

const ProximityFormContainer = ({ initialAddress }: { initialAddress?: string}) => {
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const setParams = useSetAtom(paramsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: SearchParams = {};

    // We want to always set something as the keyword parameter so that
    // the focus will move to result title every time when submitting
    // the form. If there are no parameters the form isn't really submitted
    // even if the submit button is pressed and then the focus doesn't
    // move to results header. Accessibility however requires the focus to
    // move in case an empty form is submitted as well.
    if (keyword && keyword.length) {
      params.keyword = keyword;
    } else {
      params.keyword = '';
    }

    setParams(params);
  };

  return (
    <form
      className='hdbt-search--react__form-container'
      role='search'
      onSubmit={onSubmit}
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
        defaultValue={initialAddress || ''}
        helperText={Drupal.t('Enter the street name and house number', {}, { context: 'React search: street input helper'})}
        id='keyword'
        label={Drupal.t('The child\'s home address', {}, { context: 'School search: input label'})}
        onChange={(value: string) => setKeyword(value)}
        onSubmit={(value: string) => setKeyword(value)}
        placeholder={Drupal.t('For example, Kotikatu 1', {}, { context: 'React search: street input helper placeholder'})}
        visibleSuggestions={5}
      />
      <Button
        className='hdbt-search--react__submit-button'
        type='submit'
      >
        {Drupal.t('Search', {}, { context: 'React search: submit button label'})}
      </Button>
    </form>
  );
};

export default ProximityFormContainer;

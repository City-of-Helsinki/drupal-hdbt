import { useAtomValue, useSetAtom } from 'jotai';
import { Button, Checkbox, TextInput } from 'hds-react';
import { useState } from 'react';
import { stagedParamsAtom, updateParamsAtom } from '../store';
import type SearchParams from '../types/SearchParams';
import SelectionsContainer from './SelectionsContainer';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
  finnish_education: HTMLInputElement;
  grades_1_6: HTMLInputElement;
  swedish_education: HTMLInputElement;
  grades_7_9: HTMLInputElement;
};

const FeatureFormContainer = () => {
  const [keywordValue, setKeywordValue] = useState<string|undefined>();
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword, finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    };

    [finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education, ].forEach(element => {
      if (!element || !element.checked || !element.name) {
        return;
      };

      const name = element.name as keyof Omit<SearchParams, 'keyword'|'page'|'query'>;
      params[name] = true;
    });

    setParams(params);
  };

  const keys: Array<keyof Omit<SearchParams, 'keyword'|'page'|'query'>> = ['grades_1_6', 'grades_1_9', 'grades_7_9', 'finnish_education', 'swedish_education'];

  return (
    <form className='react-search__form-container' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search with school details', {}, {context: 'School search: Feature form title'})}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'You can search for a school by its name, language of instruction, grade or post code.',
          {},
          {context: 'School search: Feature form description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        id='keyword'
        label={Drupal.t('School\'s name or post code', {}, {context: 'School search: Feature input label'})}
        name='keyword'
        onChange={({target: { value }}: { target: { value: string }}) => setKeywordValue(value)}
        type='search'
        value={keywordValue}
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='react-search__fieldset'>
          <legend className='react-search__legend'>
            {Drupal.t('Language of instruction', {}, {context: 'School search: language options'})}
          </legend>
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.finnish_education || false}
            id='finnish_education'
            label={Drupal.t('Finnish')}
            name='finnish_education'
            onClick={() => setStagedParams({...stagedParams, finnish_education: !stagedParams?.finnish_education})}
            value={stagedParams?.finnish_education?.toString() || 'false'}
          />
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.swedish_education || false}
            id='swedish_education'
            label={Drupal.t('Swedish')}
            name='swedish_education'
            onClick={() => setStagedParams({...stagedParams, swedish_education: !stagedParams?.swedish_education})}
            value={stagedParams?.swedish_education?.toString() || 'false'}
          />
        </fieldset>
        <fieldset className='react-search__fieldset'>
          <legend className='react-search__legend'>
            {Drupal.t('Grade', {}, {context: 'School search: education level'})}
          </legend>
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.grades_1_6 || false}
            id='grades_1_6'
            label={Drupal.t('School providing grades 1 to 6', {}, {context: 'School search: education level option'})}
            name='grades_1_6'
            onClick={() => setStagedParams({...stagedParams, grades_1_6: !stagedParams?.grades_1_6})}
            value={stagedParams?.grades_1_6?.toString() || 'false'}
          />
          <Checkbox
            className='react-search__checkbox'
            id='grades_1_9'
            checked={stagedParams?.grades_1_9 || false}
            label={Drupal.t('School providing grades 1 to 9', {}, {context: 'School search: education level option'})}
            name='grades_1_9'
            onClick={() => setStagedParams({...stagedParams, grades_1_9: !stagedParams?.grades_1_9})}
            value={stagedParams?.grades_1_9?.toString() || 'false'}
          />
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.grades_7_9 || false}
            id='grades_7_9'
            label={Drupal.t('School providing grades 7 to 9', {}, {context: 'School search: education level option'})}
            name='grades_7_9'
            onClick={() => setStagedParams({...stagedParams, grades_7_9: !stagedParams?.grades_7_9})}
            value={stagedParams?.grades_7_9?.toString() || 'false'}
          />
        </fieldset>
      </div>
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Search')}</Button>
      <SelectionsContainer keys={keys} />
    </form>
  );
};

export default FeatureFormContainer;

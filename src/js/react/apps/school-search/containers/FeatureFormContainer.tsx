import { useAtomValue, useSetAtom } from 'jotai';
import { Button, Checkbox, TextInput } from 'hds-react';
import { useState } from 'react';
import { paramsAtom, stagedParamsAtom, updateParamsAtom } from '../store';
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
    const { keyword, finnish_education, grades_1_6, swedish_education, grades_7_9 } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    };

    [finnish_education, grades_1_6, swedish_education, grades_7_9].forEach(element => {
      if (!element || !element.checked || !element.name) {
        return;
      };

      const name = element.name as keyof Omit<SearchParams, 'keyword'|'page'|'query'>;
      params[name] = true;
    });

    setParams(params);
  };

  const keys: Array<keyof Omit<SearchParams, 'keyword'|'page'|'query'>> = ['grades_1_6', 'grades_7_9', 'finnish_education', 'swedish_education'];

  return (
    <form className='react-search__form-container' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search by school features')}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'You can search schools by name, language, level, or postal code. Students may be accepted into schools outside of their own district if there\'s room. Note that some schools require passing an exam.',
          {},
          {context: 'Feature search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        id='keyword'
        label={Drupal.t('School name or postal code')}
        name='keyword'
        onChange={({target: { value }}: { target: { value: string }}) => setKeywordValue(value)}
        type='search'
        value={keywordValue}
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='react-search__fieldset'>
          <legend className='react-search__legend'>
            {Drupal.t('Education language')}
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
            {Drupal.t('Education level')}
          </legend>
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.grades_1_6 || false}
            id='grades_1_6'
            label={Drupal.t('Lower levels (1-6)')}
            name='grades_1_6'
            onClick={() => setStagedParams({...stagedParams, grades_1_6: !stagedParams?.grades_1_6})}
            value={stagedParams?.grades_1_6?.toString() || 'false'}
          />
          <Checkbox
            className='react-search__checkbox'
            checked={stagedParams?.grades_7_9 || false}
            id='grades_7_9'
            label={Drupal.t('Upper levels (7-9)')}
            name='grades_7_9'
            onClick={() => setStagedParams({...stagedParams, grades_7_9: !stagedParams?.grades_7_9})}
            value={stagedParams?.grades_7_9?.toString() || 'false'}
          />
        </fieldset>
      </div>
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Submit')}</Button>
      <SelectionsContainer keys={keys} />
    </form>
  );
};

export default FeatureFormContainer;

import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, Checkbox, TextInput, Select, } from 'hds-react';
import { useState } from 'react';

import {
  stagedParamsAtom,
  updateParamsAtom,
  a1Atom,
  a1SelectionAtom,
  a2Atom,
  a2SelectionAtom,
  b1Atom,
  b1SelectionAtom,
  b2Atom,
  b2SelectionAtom,
  weightedEducationAtom,
  weightedEducationSelectionAtom,
  bilingualEducationAtom,
  bilingualEducationSelectionAtom
} from '../store';
import type SearchParams from '../types/SearchParams';
import SelectionsContainer from './SelectionsContainer';
import SearchComponents from '../enum/SearchComponents';
import OptionType from '../types/OptionType';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
  finnish_education: HTMLInputElement;
  swedish_education: HTMLInputElement;
  grades_1_6: HTMLInputElement;
  grades_7_9: HTMLInputElement;
};

const FeatureFormContainer = () => {
  const [keywordValue, setKeywordValue] = useState<string|undefined>();
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);
  const a1Options = useAtomValue(a1Atom);
  const [a1Selection, setA1Filter] = useAtom(a1SelectionAtom);
  const a2Options = useAtomValue(a2Atom);
  const [a2Selection, setA2Filter] = useAtom(a2SelectionAtom);
  const b1Options = useAtomValue(b1Atom);
  const [b1Selection, setB1Filter] = useAtom(b1SelectionAtom);
  const b2Options = useAtomValue(b2Atom);
  const [b2Selection, setB2Filter] = useAtom(b2SelectionAtom);
  const weightedOptions = useAtomValue(weightedEducationAtom);
  const [weightedSelection, setWeightedFilter] = useAtom(weightedEducationSelectionAtom);
  const bilingualOptions = useAtomValue(bilingualEducationAtom);
  const [bilingualSelection, setBilingualFilter] = useAtom(bilingualEducationSelectionAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { keyword, finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    };

    [finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education].forEach(element => {
      if (!element || !element.checked || !element.name) {
        return;
      };

      const name = element.name as keyof Omit<SearchParams, 'keyword'|'page'|'query'|'a1'|'a2'|'b1'|'b2'|'weighted_education'|'bilingual_education'>;
      params[name] = true;
    });

    params.a1 = a1Selection.map((selection: OptionType) => selection.value);
    params.a2 = a2Selection.map((selection: OptionType) => selection.value);
    params.b1 = b1Selection.map((selection: OptionType) => selection.value);
    params.b2 = b2Selection.map((selection: OptionType) => selection.value);
    params.weighted_education = weightedSelection.map((selection: OptionType) => selection.value);
    params.bilingual_education = bilingualSelection.flatMap((selection: OptionType) => selection.value.split(','));

    setParams(params);
  };

  const keys: Array<keyof Omit<SearchParams, 'keyword'|'page'|'query'|'a1'|'a2'|'b1'|'b2'|'weighted_education'|'bilingual_education'>> = ['grades_1_6', 'grades_1_9', 'grades_7_9', 'finnish_education', 'swedish_education'];
  const a1Label: string = Drupal.t('Foreign language starting in 1st grade (A1)', {}, { context: 'TPR Ontologyword details schools' });
  const a2Label: string = Drupal.t('Optional foreign language starting in 3rd grade (A2)', {}, { context: 'TPR Ontologyword details schools' });
  const b1Label: string = Drupal.t('Second national language starting in 6th grade (B1)', {}, { context: 'TPR Ontologyword details schools' });
  const b2Label: string = Drupal.t('Optional foreign language starting in 8th grade (B2)', {}, { context: 'TPR Ontologyword details schools' });
  const weightedEducationLabel: string = Drupal.t('Weighted curriculum education', {}, { context: 'TPR Ontologyword details schools' });
  const bilingualEducationLabel: string = Drupal.t('Bilingual education', {}, { context: 'TPR Ontologyword details schools' });

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search with school details', {}, {context: 'School search: Feature form title'})}
      </h3>
      <p className='hdbt-search--react__form-description'>
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
        placeholder={Drupal.t('E.g. Aurinkolahti Comprehensive School or 00990', {}, {context: 'School search: text input placeholder'})}
      />
      <div className='hdbt-search--react__checkbox-filter-container'>
        <fieldset className='hdbt-search--react__fieldset'>
          <legend className='hdbt-search--react__legend'>
            {Drupal.t('Language of instruction', {}, {context: 'School search: language options'})}
          </legend>
          <Checkbox
            className='hdbt-search--react__checkbox'
            checked={stagedParams?.finnish_education || false}
            id='finnish_education'
            label={Drupal.t('Finnish', {}, {context: 'School search: language option'})}
            name='finnish_education'
            onClick={() => setStagedParams({...stagedParams, finnish_education: !stagedParams?.finnish_education})}
            value={stagedParams?.finnish_education?.toString() || 'false'}
          />
          <Checkbox
            className='hdbt-search--react__checkbox'
            checked={stagedParams?.swedish_education || false}
            id='swedish_education'
            label={Drupal.t('Swedish', {}, {context: 'School search: language option'})}
            name='swedish_education'
            onClick={() => setStagedParams({...stagedParams, swedish_education: !stagedParams?.swedish_education})}
            value={stagedParams?.swedish_education?.toString() || 'false'}
          />
        </fieldset>
        <fieldset className='hdbt-search--react__fieldset'>
          <legend className='hdbt-search--react__legend'>
            {Drupal.t('Grade', {}, {context: 'School search: education level'})}
          </legend>
          <Checkbox
            className='hdbt-search--react__checkbox'
            checked={stagedParams?.grades_1_6 || false}
            id='grades_1_6'
            label={Drupal.t('School providing grades 1 to 6', {}, {context: 'School search: education level option'})}
            name='grades_1_6'
            onClick={() => setStagedParams({...stagedParams, grades_1_6: !stagedParams?.grades_1_6})}
            value={stagedParams?.grades_1_6?.toString() || 'false'}
          />
          <Checkbox
            className='hdbt-search--react__checkbox'
            id='grades_1_9'
            checked={stagedParams?.grades_1_9 || false}
            label={Drupal.t('School providing grades 1 to 9', {}, {context: 'School search: education level option'})}
            name='grades_1_9'
            onClick={() => setStagedParams({...stagedParams, grades_1_9: !stagedParams?.grades_1_9})}
            value={stagedParams?.grades_1_9?.toString() || 'false'}
          />
          <Checkbox
            className='hdbt-search--react__checkbox'
            checked={stagedParams?.grades_7_9 || false}
            id='grades_7_9'
            label={Drupal.t('School providing grades 7 to 9', {}, {context: 'School search: education level option'})}
            name='grades_7_9'
            onClick={() => setStagedParams({...stagedParams, grades_7_9: !stagedParams?.grades_7_9})}
            value={stagedParams?.grades_7_9?.toString() || 'false'}
          />
        </fieldset>
      </div>
      <div className='hdbt-search--react__dropdown-filters'>
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': a1Label}, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All languages', {}, {context: 'School search: language placeholder'})}
          multiselect
          label={a1Label}
          options={a1Options}
          value={a1Selection}
          id={SearchComponents.A1}
          onChange={setA1Filter}
        />
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': a2Label}, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All languages', {}, {context: 'School search: language placeholder'})}
          multiselect
          label={a2Label}
          options={a2Options}
          value={a2Selection}
          id={SearchComponents.A2}
          onChange={setA2Filter}
        />
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': b1Label}, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All languages', {}, {context: 'School search: language placeholder'})}
          multiselect
          label={b1Label}
          options={b1Options}
          value={b1Selection}
          id={SearchComponents.B1}
          onChange={setB1Filter}
        />
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', {'@label': b2Label}, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All languages', {}, {context: 'School search: language placeholder'})}
          multiselect
          label={b2Label}
          options={b2Options}
          value={b2Selection}
          id={SearchComponents.B2}
          onChange={setB2Filter}
        />
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': weightedEducationLabel }, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All', {}, {context: 'React search all placeholder'})}
          multiselect
          label={weightedEducationLabel}
          options={weightedOptions}
          value={weightedSelection}
          id={SearchComponents.WeightedEducation}
          onChange={setWeightedFilter}
        />
        {/* @ts-ignore */}
        <Select
          clearable
          clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': bilingualEducationLabel }, { context: 'React search clear selection label' })}
          className='hdbt-search--react__dropdown'
          selectedItemRemoveButtonAriaLabel={Drupal.t(
            'Remove item',
            {},
            { context: 'React search remove item aria label' }
          )}
          placeholder={Drupal.t('All', {}, {context: 'React search all placeholder'})}
          multiselect
          label={bilingualEducationLabel}
          options={bilingualOptions}
          value={bilingualSelection}
          id={SearchComponents.BilingualEducation}
          onChange={setBilingualFilter}
        />
      </div>
      <div className='hdbt-search--react__submit'>
        <Button
          className='hdbt-search--react__submit-button'
          type='submit'
          variant='primary'
          theme='black'
        >
          {Drupal.t('Search', {}, {context: 'React search: submit button label'})}
        </Button>
        </div>
      <SelectionsContainer keys={keys} />
    </form>
  );
};

export default FeatureFormContainer;

import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, ButtonVariant, ButtonPresetTheme, Checkbox, TextInput, Select, } from 'hds-react';
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
  const [keywordValue, setKeywordValue] = useState<string>('');
  const stagedParams = useAtomValue(stagedParamsAtom) || {};
  const setParams = useSetAtom(updateParamsAtom);
  const setStagedParams = useSetAtom(stagedParamsAtom);
  const a1Options = useAtomValue(a1Atom);
  const [a1SelectOpen, setA1SelectOpen] = useState(false);
  const [a1Selection, setA1Filter] = useAtom(a1SelectionAtom);
  const a2Options = useAtomValue(a2Atom);
  const [a2SelectOpen, setA2SelectOpen] = useState(false);
  const [a2Selection, setA2Filter] = useAtom(a2SelectionAtom);
  const b1Options = useAtomValue(b1Atom);
  const [b1SelectOpen, setB1SelectOpen] = useState(false);
  const [b1Selection, setB1Filter] = useAtom(b1SelectionAtom);
  const b2Options = useAtomValue(b2Atom);
  const [b2SelectOpen, setB2SelectOpen] = useState(false);
  const [b2Selection, setB2Filter] = useAtom(b2SelectionAtom);
  const weightedOptions = useAtomValue(weightedEducationAtom);
  const [weightedOptionsSelectOpen, setWeightedOptionsSelectOpen] = useState(false);
  const [weightedSelection, setWeightedFilter] = useAtom(weightedEducationSelectionAtom);
  const bilingualOptions = useAtomValue(bilingualEducationAtom);
  const [bilingualOptionsSelectOpen, setBilingualOptionsSelectOpen] = useState(false);
  const [bilingualSelection, setBilingualFilter] = useAtom(bilingualEducationSelectionAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { keyword, finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    }

    [finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education].forEach(element => {
      if (!element || !element.checked || !element.name) {
        return;
      }

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
  const a1Label: string = Drupal.t('Language starting in Grade 1 (A1)', {}, { context: 'TPR Ontologyword details schools' });
  const a2Label: string = Drupal.t('Language starting in Grade 3 (A2)', {}, { context: 'TPR Ontologyword details schools' });
  const b1Label: string = Drupal.t('Language starting in Grade 6 (B1)', {}, { context: 'TPR Ontologyword details schools' });
  const b2Label: string = Drupal.t('Language starting in Grade 7 or 8 (B2)', {}, { context: 'TPR Ontologyword details schools' });
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
        onChange={({ target: { value } }) => setKeywordValue(value)}
        placeholder={Drupal.t('E.g. Aurinkolahti Comprehensive School or 00990', {}, {context: 'School search: text input placeholder'})}
        type='search'
        value={keywordValue || ''} // Ensure value is always a string.
      />
      <div className='hdbt-search--react__checkbox-filter-container'>
        <fieldset className='hdbt-search--react__fieldset'>
          <legend className='hdbt-search--react__legend'>
            {Drupal.t('Language of instruction', {}, {context: 'School search: language options'})}
          </legend>
          <Checkbox
            checked={stagedParams?.finnish_education || false}
            className='hdbt-search--react__checkbox'
            id='finnish_education'
            label={Drupal.t('Finnish', {}, {context: 'School search: language option'})}
            name='finnish_education'
            onClick={() => setStagedParams({...stagedParams, finnish_education: !stagedParams?.finnish_education})}
            value={stagedParams?.finnish_education?.toString() || 'false'}
          />
          <Checkbox
            checked={stagedParams?.swedish_education || false}
            className='hdbt-search--react__checkbox'
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
            checked={stagedParams?.grades_1_6 || false}
            className='hdbt-search--react__checkbox'
            id='grades_1_6'
            label={Drupal.t('School providing grades 1 to 6', {}, {context: 'School search: education level option'})}
            name='grades_1_6'
            onClick={() => setStagedParams({...stagedParams, grades_1_6: !stagedParams?.grades_1_6})}
            value={stagedParams?.grades_1_6?.toString() || 'false'}
          />
          <Checkbox
            checked={stagedParams?.grades_1_9 || false}
            className='hdbt-search--react__checkbox'
            id='grades_1_9'
            label={Drupal.t('School providing grades 1 to 9', {}, {context: 'School search: education level option'})}
            name='grades_1_9'
            onClick={() => setStagedParams({...stagedParams, grades_1_9: !stagedParams?.grades_1_9})}
            value={stagedParams?.grades_1_9?.toString() || 'false'}
          />
          <Checkbox
            checked={stagedParams?.grades_7_9 || false}
            className='hdbt-search--react__checkbox'
            id='grades_7_9'
            label={Drupal.t('School providing grades 7 to 9', {}, {context: 'School search: education level option'})}
            name='grades_7_9'
            onClick={() => setStagedParams({...stagedParams, grades_7_9: !stagedParams?.grades_7_9})}
            value={stagedParams?.grades_7_9?.toString() || 'false'}
          />
        </fieldset>
      </div>
      <div className='hdbt-search--react__dropdown-filters'>
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.A1}
          multiSelect
          noTags
          onBlur={() => setA1SelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setA1Filter(selectedOptions);
            if (clickedOption) setA1SelectOpen(true);
          }}
          open={a1SelectOpen}
          options={a1Options}
          texts={{
            label: a1Label,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': a2Label}, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': a2Label}, { context: 'React search clear selection label' }),
          }}
          value={a1Selection}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.A2}
          multiSelect
          noTags
          onBlur={() => setA2SelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setA2Filter(selectedOptions);
            if (clickedOption) setA2SelectOpen(true);
          }}
          open={a2SelectOpen}
          options={a2Options}
          texts={{
            label: a2Label,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': a2Label}, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': a2Label}, { context: 'React search clear selection label' }),
          }}
          value={a2Selection}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.B1}
          multiSelect
          noTags
          onBlur={() => setB1SelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setB1Filter(selectedOptions);
            if (clickedOption) setB1SelectOpen(true);
          }}
          open={b1SelectOpen}
          options={b1Options}
          texts={{
            label: b1Label,
            placeholder: Drupal.t('All languages', {}, {context: 'School search: language placeholder'}),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': b1Label}, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': b1Label}, { context: 'React search clear selection label' })
          }}
          value={b1Selection}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.B2}
          multiSelect
          noTags
          onBlur={() => setB2SelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setB2Filter(selectedOptions);
            if (clickedOption) setB2SelectOpen(true);
          }}
          open={b2SelectOpen}
          options={b2Options}
          texts={{
            label: b2Label,
            placeholder: Drupal.t('All languages', {}, {context: 'School search: language placeholder'}),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': b2Label}, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': b2Label}, { context: 'React search clear selection label' }),
          }}
          value={b2Selection}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.WeightedEducation}
          multiSelect
          noTags
          onBlur={() => setWeightedOptionsSelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setWeightedFilter(selectedOptions);
            if (clickedOption) setWeightedOptionsSelectOpen(true);
          }}
          open={weightedOptionsSelectOpen}
          options={weightedOptions}
          texts={{
            label: weightedEducationLabel,
            placeholder: Drupal.t('All', {}, {context: 'React search all placeholder'}),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', { '@label': weightedEducationLabel }, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', { '@label': weightedEducationLabel }, { context: 'React search clear selection label' })
          }}
          value={weightedSelection}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.BilingualEducation}
          multiSelect
          noTags
          onBlur={() => setBilingualOptionsSelectOpen(false)}
          onChange={(selectedOptions, clickedOption) => {
            setBilingualFilter(selectedOptions);
            if (clickedOption) setBilingualOptionsSelectOpen(true);
          }}
          open={bilingualOptionsSelectOpen}
          options={bilingualOptions}
          texts={{
            label: bilingualEducationLabel,
            placeholder: Drupal.t('All', {}, {context: 'React search all placeholder'}),
            clearButtonAriaLabel_one: Drupal.t('Clear @label selection', { '@label': bilingualEducationLabel }, { context: 'React search clear selection label' }),
            clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', { '@label': bilingualEducationLabel }, { context: 'React search clear selection label' })
          }}
          value={bilingualSelection}
        />
      </div>
      <div className='hdbt-search--react__submit'>
        <Button
          className='hdbt-search--react__submit-button'
          theme={ButtonPresetTheme.Black}
          type='submit'
          variant={ButtonVariant.Primary}
        >
          {Drupal.t('Search', {}, {context: 'React search: submit button label'})}
        </Button>
      </div>
      <SelectionsContainer keys={keys} />
    </form>
  );
};

export default FeatureFormContainer;

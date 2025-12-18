import { Button, Checkbox, Select, TextInput } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import SearchComponents from '../enum/SearchComponents';
import {
  a1Atom,
  a1SelectionAtom,
  a2Atom,
  a2SelectionAtom,
  b1Atom,
  b1SelectionAtom,
  b2Atom,
  b2SelectionAtom,
  bilingualEducationAtom,
  bilingualEducationSelectionAtom,
  stagedParamsAtom,
  updateParamsAtom,
  weightedEducationAtom,
  weightedEducationSelectionAtom,
} from '../store';
import type OptionType from '../types/OptionType';
import type SearchParams from '../types/SearchParams';
import SelectionsContainer from './SelectionsContainer';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
  finnish_education: HTMLInputElement;
  swedish_education: HTMLInputElement;
  english_education: HTMLInputElement;
  grades_1_6: HTMLInputElement;
  grades_7_9: HTMLInputElement;
};

const FeatureFormContainer = () => {
  const [keywordValue, setKeywordValue] = useState<string>('');
  const stagedParams = useAtomValue(stagedParamsAtom) || {};
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

    const { keyword, finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education, english_education } =
      event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value?.length) {
      params.keyword = keyword.value;
    }

    [finnish_education, grades_1_6, grades_1_9, grades_7_9, swedish_education, english_education].forEach((element) => {
      if (!element || !element.checked || !element.name) {
        return;
      }

      const name = element.name as keyof Omit<
        SearchParams,
        'keyword' | 'page' | 'query' | 'a1' | 'a2' | 'b1' | 'b2' | 'weighted_education' | 'bilingual_education'
      >;
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

  console.log('stagedParams', stagedParams);

  const keys: Array<
    keyof Omit<
      SearchParams,
      'keyword' | 'page' | 'query' | 'a1' | 'a2' | 'b1' | 'b2' | 'weighted_education' | 'bilingual_education'
    >
  > = ['grades_1_6', 'grades_1_9', 'grades_7_9', 'finnish_education', 'swedish_education', 'english_education'];
  const a1Label: string = Drupal.t(
    'Language starting in Grade 1 (A1)',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const a2Label: string = Drupal.t(
    'Language starting in Grade 3 (A2)',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const b1Label: string = Drupal.t(
    'Language starting in Grade 6 (B1)',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const b2Label: string = Drupal.t(
    'Language starting in Grade 7 or 8 (B2)',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const weightedEducationLabel: string = Drupal.t(
    'Weighted curriculum education',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const bilingualEducationLabel: string = Drupal.t(
    'Bilingual education',
    {},
    { context: 'TPR Ontologyword details schools' },
  );
  const currentLanguage = getCurrentLanguage(window.drupalSettings.path.currentLanguage);

  return (
    // biome-ignore lint/a11y/useSemanticElements: @todo UHF-12501
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <h3>{Drupal.t('Search with school details', {}, { context: 'School search: Feature form title' })}</h3>
      <p className='hdbt-search--react__form-description'>
        {Drupal.t(
          'You can search for a school by its name, language of instruction, grade or post code.',
          {},
          { context: 'School search: Feature form description' },
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        id='keyword'
        label={Drupal.t("School's name or post code", {}, { context: 'School search: Feature input label' })}
        name='keyword'
        onChange={({ target: { value } }) => setKeywordValue(value)}
        placeholder={Drupal.t(
          'E.g. Aurinkolahti Comprehensive School or 00990',
          {},
          { context: 'School search: text input placeholder' },
        )}
        type='search'
        value={keywordValue || ''} // Ensure value is always a string.
        clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search' })}
        style={defaultTextInputStyle}
      />
      <div className='hdbt-search--react__checkbox-filter-container'>
        <fieldset className='hdbt-search--react__fieldset'>
          <legend className='hdbt-search--react__legend'>
            {Drupal.t('Language of instruction', {}, { context: 'School search: language options' })}
          </legend>
          <Checkbox
            checked={stagedParams?.finnish_education || false}
            className='hdbt-search--react__checkbox'
            id='finnish_education'
            label={Drupal.t('Finnish', {}, { context: 'School search: language option' })}
            name='finnish_education'
            onClick={() => setStagedParams({ ...stagedParams, finnish_education: !stagedParams?.finnish_education })}
            value={stagedParams?.finnish_education?.toString() || 'false'}
            style={defaultCheckboxStyle}
          />
          <Checkbox
            checked={stagedParams?.swedish_education || false}
            className='hdbt-search--react__checkbox'
            id='swedish_education'
            label={Drupal.t('Swedish', {}, { context: 'School search: language option' })}
            name='swedish_education'
            onClick={() => setStagedParams({ ...stagedParams, swedish_education: !stagedParams?.swedish_education })}
            value={stagedParams?.swedish_education?.toString() || 'false'}
            style={defaultCheckboxStyle}
          />
          <Checkbox
            checked={stagedParams?.english_education || false}
            className='hdbt-search--react__checkbox'
            id='english_education'
            label={Drupal.t('English', {}, { context: 'School search: language option' })}
            name='english_education'
            onClick={() => setStagedParams({ ...stagedParams, english_education: !stagedParams?.english_education })}
            value={stagedParams?.english_education?.toString() || 'false'}
            style={defaultCheckboxStyle}
          />
        </fieldset>
        <fieldset className='hdbt-search--react__fieldset'>
          <legend className='hdbt-search--react__legend'>
            {Drupal.t('Grade', {}, { context: 'School search: education level' })}
          </legend>
          <Checkbox
            checked={stagedParams?.grades_1_6 || false}
            className='hdbt-search--react__checkbox'
            id='grades_1_6'
            label={Drupal.t('School providing grades 1 to 6', {}, { context: 'School search: education level option' })}
            name='grades_1_6'
            onClick={() => setStagedParams({ ...stagedParams, grades_1_6: !stagedParams?.grades_1_6 })}
            value={stagedParams?.grades_1_6?.toString() || 'false'}
            style={defaultCheckboxStyle}
          />
          <Checkbox
            checked={stagedParams?.grades_1_9 || false}
            className='hdbt-search--react__checkbox'
            id='grades_1_9'
            label={Drupal.t('School providing grades 1 to 9', {}, { context: 'School search: education level option' })}
            name='grades_1_9'
            onClick={() => setStagedParams({ ...stagedParams, grades_1_9: !stagedParams?.grades_1_9 })}
            value={stagedParams?.grades_1_9?.toString() || 'false'}
            style={defaultCheckboxStyle}
          />
          <Checkbox
            checked={stagedParams?.grades_7_9 || false}
            className='hdbt-search--react__checkbox'
            id='grades_7_9'
            label={Drupal.t('School providing grades 7 to 9', {}, { context: 'School search: education level option' })}
            name='grades_7_9'
            onClick={() => setStagedParams({ ...stagedParams, grades_7_9: !stagedParams?.grades_7_9 })}
            value={stagedParams?.grades_7_9?.toString() || 'false'}
            style={defaultCheckboxStyle}
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
          onChange={(selectedOptions) => {
            setA1Filter(selectedOptions);
          }}
          options={a1Options}
          texts={{
            label: a1Label,
            language: currentLanguage,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': a2Label },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': a2Label },
              { context: 'React search clear selection label' },
            ),
          }}
          value={a1Selection}
          theme={defaultMultiSelectTheme}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.A2}
          multiSelect
          noTags
          onChange={(selectedOptions, _clickedOption) => {
            setA2Filter(selectedOptions);
          }}
          options={a2Options}
          texts={{
            label: a2Label,
            language: currentLanguage,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': a2Label },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': a2Label },
              { context: 'React search clear selection label' },
            ),
          }}
          value={a2Selection}
          theme={defaultMultiSelectTheme}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.B1}
          multiSelect
          noTags
          onChange={(selectedOptions) => {
            setB1Filter(selectedOptions);
          }}
          options={b1Options}
          texts={{
            label: b1Label,
            language: currentLanguage,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': b1Label },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': b1Label },
              { context: 'React search clear selection label' },
            ),
          }}
          value={b1Selection}
          theme={defaultMultiSelectTheme}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.B2}
          multiSelect
          noTags
          onChange={(selectedOptions) => {
            setB2Filter(selectedOptions);
          }}
          options={b2Options}
          texts={{
            label: b2Label,
            language: currentLanguage,
            placeholder: Drupal.t('All languages', {}, { context: 'School search: language placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': b2Label },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': b2Label },
              { context: 'React search clear selection label' },
            ),
          }}
          value={b2Selection}
          theme={defaultMultiSelectTheme}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.WeightedEducation}
          multiSelect
          noTags
          onChange={(selectedOptions) => {
            setWeightedFilter(selectedOptions);
          }}
          options={weightedOptions}
          texts={{
            label: weightedEducationLabel,
            language: currentLanguage,
            placeholder: Drupal.t('All', {}, { context: 'React search all placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': weightedEducationLabel },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': weightedEducationLabel },
              { context: 'React search clear selection label' },
            ),
          }}
          value={weightedSelection}
          theme={defaultMultiSelectTheme}
        />
        <Select
          className='hdbt-search--react__dropdown'
          clearable
          id={SearchComponents.BilingualEducation}
          multiSelect
          noTags
          onChange={(selectedOptions) => {
            setBilingualFilter(selectedOptions);
            console.log('selectedOptions', selectedOptions);
          }}
          options={bilingualOptions}
          texts={{
            label: bilingualEducationLabel,
            language: currentLanguage,
            placeholder: Drupal.t('All', {}, { context: 'React search all placeholder' }),
            clearButtonAriaLabel_one: Drupal.t(
              'Clear @label selection',
              { '@label': bilingualEducationLabel },
              { context: 'React search clear selection label' },
            ),
            clearButtonAriaLabel_multiple: Drupal.t(
              'Clear @label selection',
              { '@label': bilingualEducationLabel },
              { context: 'React search clear selection label' },
            ),
          }}
          value={bilingualSelection}
          theme={defaultMultiSelectTheme}
        />
      </div>
      <div className='hdbt-search--react__submit'>
        <Button className='hdbt-search--react__submit-button' type='submit'>
          {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
        </Button>
      </div>
      <SelectionsContainer keys={keys} />
    </form>
  );
};

export default FeatureFormContainer;

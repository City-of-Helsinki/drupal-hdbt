import { Accordion, AccordionSize, Button, defaultFilter, IconLocation, Select, TextInput } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import SearchComponents from '../enum/SearchComponents';
import { ComponentMap } from '../helpers/helpers';
import transformDropdownsValues from '../helpers/Params';
import {
  districtSelectionAtom,
  districtsAtom,
  phaseSelectionAtom,
  phasesAtom,
  themeSelectionAtom,
  themesAtom,
  titleAtom,
  typeSelectionAtom,
  typesAtom,
  urlAtom,
  urlUpdateAtom,
} from '../store';
import type OptionType from '../types/OptionType';
import type URLParams from '../types/URLParams';
import SelectionsContainer from './SelectionsContainer';

const FormContainer = () => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const districtOptions = useAtomValue(districtsAtom);
  const [districtSelection, setDistrictFilter] = useAtom(districtSelectionAtom);
  const themeOptions = useAtomValue(themesAtom);
  const [themeSelection, setThemeFilter] = useAtom(themeSelectionAtom);
  const phaseOptions = useAtomValue(phasesAtom);
  const [phaseSelection, setPhaseFilter] = useAtom(phaseSelectionAtom);
  const typeOptions = useAtomValue(typesAtom);
  const [typeSelection, setTypeFilter] = useAtom(typeSelectionAtom);

  // Set form control values from url parameters on load

  // Memoize the transform function
  const getTransformedValues = useCallback(
    (paramValue: string[] | undefined, options: OptionType[] | undefined): OptionType[] => {
      return transformDropdownsValues(paramValue, options);
    },
    [],
  );

  // Memoize the initialization effect
  const initializeForm = useCallback(() => {
    setTitle(urlParams?.title?.toString() || '');
    setDistrictFilter(getTransformedValues(urlParams?.districts, districtOptions));
    setThemeFilter(getTransformedValues(urlParams?.project_theme, themeOptions));
    setPhaseFilter(getTransformedValues(urlParams?.project_phase, phaseOptions));
    setTypeFilter(getTransformedValues(urlParams?.project_type, typeOptions));
  }, [
    urlParams,
    districtOptions,
    themeOptions,
    phaseOptions,
    typeOptions,
    getTransformedValues,
    setTitle,
    setDistrictFilter,
    setThemeFilter,
    setPhaseFilter,
    setTypeFilter,
  ]);

  // Use the memoized function in useEffect
  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  // Memoize the submit handler
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setUrlParams({
        title,
        districts: districtSelection.map((selection: OptionType) => selection.value),
        project_theme: themeSelection.map((selection: OptionType) => selection.value),
        project_phase: phaseSelection.map((selection: OptionType) => selection.value),
        project_type: typeSelection.map((selection: OptionType) => selection.value),
      });
    },
    [title, districtSelection, themeSelection, phaseSelection, typeSelection, setUrlParams],
  );

  // Memoize the title change handler
  const handleTitleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(value);
    },
    [setTitle],
  );

  const accordionInitiallyOpen = !!Object.keys(urlParams).find(
    (param) => Object.keys(ComponentMap).includes(param) && urlParams?.[param as keyof URLParams]?.length,
  );
  const residentialAreaLabel: string = Drupal.t(
    'Residential area',
    {},
    { context: 'District and project search form label' },
  );
  const projectThemeLabel: string = Drupal.t(
    'Project theme',
    {},
    { context: 'District and project search form label' },
  );
  const projectStageLabel: string = Drupal.t(
    'Project stage',
    {},
    { context: 'District and project search form label' },
  );
  const projectTypeLabel: string = Drupal.t('Project type', {}, { context: 'District and project search form label' });
  const currentLanguage = getCurrentLanguage(window.drupalSettings.path.currentLanguage);

  return (
    // biome-ignore lint/a11y/useSemanticElements: @todo UHF-12501
    <form onSubmit={handleSubmit} role='search'>
      <div className='district-project-search-form__filters-container'>
        <div className='district-project-search-form__filters'>
          <TextInput
            id='district-or-project-name'
            label={Drupal.t(
              'Name of residential area or project',
              {},
              { context: 'District and project search form label' },
            )}
            onChange={handleTitleChange}
            placeholder={Drupal.t('For example, Pasila', {}, { context: 'District and project search form label' })}
            type='search'
            value={title}
            clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search' })}
            style={defaultTextInputStyle}
          />
          <Select
            filter={defaultFilter}
            clearable
            icon={<IconLocation />}
            id={SearchComponents.DISTRICTS}
            multiSelect
            noTags
            onChange={(selectedOptions) => {
              setDistrictFilter(selectedOptions);
            }}
            options={districtOptions}
            texts={{
              clearButtonAriaLabel_one: Drupal.t(
                'Clear @label selection',
                { '@label': residentialAreaLabel },
                { context: 'React search clear selection label' },
              ),
              clearButtonAriaLabel_multiple: Drupal.t(
                'Clear @label selection',
                { '@label': residentialAreaLabel },
                { context: 'React search clear selection label' },
              ),
              label: residentialAreaLabel,
              language: currentLanguage,
              placeholder: Drupal.t('All areas', {}, { context: 'District and project search form label' }),
            }}
            theme={defaultMultiSelectTheme}
            value={districtSelection}
          />
        </div>
        <Accordion
          className='district-project-search-form__additional-filters'
          heading={Drupal.t('Refine the project search', {}, { context: 'District and project search' })}
          headingLevel={3}
          initiallyOpen={accordionInitiallyOpen}
          language={window.drupalSettings.path.currentLanguage || 'fi'}
          size={AccordionSize.Small}
          theme={{ '--header-font-size': 'var(--fontsize-heading-xxs)', '--header-line-height': 'var(--lineheight-s)' }}
        >
          <div className='district-project-search-form__filters'>
            <Select
              id={SearchComponents.THEME}
              clearable
              multiSelect
              noTags
              onChange={(selectedOptions) => {
                setThemeFilter(selectedOptions);
              }}
              options={themeOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectThemeLabel },
                  { context: 'React search clear selection label' },
                ),
                clearButtonAriaLabel_multiple: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectThemeLabel },
                  { context: 'React search clear selection label' },
                ),
                label: projectThemeLabel,
                language: currentLanguage,
                placeholder: Drupal.t('All themes', {}, { context: 'District and project search form label' }),
              }}
              theme={defaultMultiSelectTheme}
              value={themeSelection}
            />
            <Select
              id={SearchComponents.PHASE}
              clearable
              multiSelect
              noTags
              onChange={(selectedOptions) => {
                setPhaseFilter(selectedOptions);
              }}
              options={phaseOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectStageLabel },
                  { context: 'React search clear selection label' },
                ),
                clearButtonAriaLabel_multiple: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectStageLabel },
                  { context: 'React search clear selection label' },
                ),
                label: projectStageLabel,
                language: currentLanguage,
                placeholder: Drupal.t('All stages', {}, { context: 'District and project search form label' }),
              }}
              theme={defaultMultiSelectTheme}
              value={phaseSelection}
            />
            <Select
              id={SearchComponents.TYPE}
              clearable
              multiSelect
              noTags
              onChange={(selectedOptions) => {
                setTypeFilter(selectedOptions);
              }}
              options={typeOptions}
              texts={{
                clearButtonAriaLabel_one: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectTypeLabel },
                  { context: 'React search clear selection label' },
                ),
                clearButtonAriaLabel_multiple: Drupal.t(
                  'Clear @label selection',
                  { '@label': projectTypeLabel },
                  { context: 'React search clear selection label' },
                ),
                label: projectTypeLabel,
                language: currentLanguage,
                placeholder: Drupal.t('All types', {}, { context: 'District and project search form label' }),
              }}
              theme={defaultMultiSelectTheme}
              value={typeSelection}
            />
          </div>
        </Accordion>
        <div className='district-project-search-form__submit'>
          <Button
            className='hdbt-search--react__submit-button district-project-search-form__submit-button'
            type='submit'
          >
            {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
          </Button>
        </div>
        <SelectionsContainer />
      </div>
    </form>
  );
};

export default FormContainer;

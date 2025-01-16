import {useEffect, useState} from 'react';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {
  Accordion,
  AccordionSize,
  Button,
  ButtonPresetTheme,
  ButtonVariant,
  defaultFilter,
  IconLocation,
  Select,
  TextInput
} from 'hds-react';

import {
  districtsAtom,
  districtSelectionAtom,
  phasesAtom,
  phaseSelectionAtom,
  themesAtom,
  themeSelectionAtom,
  titleAtom,
  typesAtom,
  typeSelectionAtom,
  urlAtom,
  urlUpdateAtom
} from '../store';
import SelectionsContainer from './SelectionsContainer';
import SearchComponents from '../enum/SearchComponents';
import transformDropdownsValues from '../helpers/Params';
import {ComponentMap} from '../helpers/helpers';
import type OptionType from '../types/OptionType';
import URLParams from '../types/URLParams';

const FormContainer = () => {
  const urlParams = useAtomValue(urlAtom);
  const setUrlParams = useSetAtom(urlUpdateAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const districtOptions = useAtomValue(districtsAtom);
  const [districtSelection, setDistrictFilter] = useAtom(districtSelectionAtom);
  const [districtSelectOpen, setDistrictSelectOpen] = useState(false);
  const themeOptions = useAtomValue(themesAtom);
  const [themeSelection, setThemeFilter] = useAtom(themeSelectionAtom);
  const [themeSelectOpen, setThemeSelectOpen] = useState(false);
  const phaseOptions = useAtomValue(phasesAtom);
  const [phaseSelection, setPhaseFilter] = useAtom(phaseSelectionAtom);
  const [phaseSelectOpen, setPhaseSelectOpen] = useState(false);
  const typeOptions = useAtomValue(typesAtom);
  const [typeSelection, setTypeFilter] = useAtom(typeSelectionAtom);
  const [typeSelectOpen, setTypeSelectOpen] = useState(false);

  // Set form control values from url parameters on load
  useEffect(() => {
    setTitle(urlParams?.title?.toString() || '');
    setDistrictFilter(transformDropdownsValues(urlParams?.districts, districtOptions));
    setThemeFilter(transformDropdownsValues(urlParams?.project_theme, themeOptions));
    setPhaseFilter(transformDropdownsValues(urlParams?.project_phase, phaseOptions));
    setTypeFilter(transformDropdownsValues(urlParams?.project_type, typeOptions));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUrlParams({
      title,
      districts: districtSelection.map((selection: OptionType) => selection.value),
      project_theme: themeSelection.map((selection: OptionType) => selection.value),
      project_phase: phaseSelection.map((selection: OptionType) => selection.value),
      project_type: typeSelection.map((selection: OptionType) => selection.value),
    });
  };

  const handleTitleChange = ({ target: { value } }: { target: { value: string } }) => setTitle(value);
  const accordionInitiallyOpen = !!Object.keys(urlParams).find(param => Object.keys(ComponentMap).includes(param) && urlParams?.[param as keyof URLParams]?.length);
  const residentialAreaLabel: string = Drupal.t('Residential area', {}, { context: 'District and project search form label' });
  const projectThemeLabel: string = Drupal.t('Project theme', {}, { context: 'District and project search form label' });
  const projectStageLabel: string = Drupal.t('Project stage', {}, { context: 'District and project search form label' });
  const projectTypeLabel: string = Drupal.t('Project type', {}, { context: 'District and project search form label' });

  return (
    <form onSubmit={handleSubmit} role='search'>
      <div className="district-project-search-form__filters-container">
        <div className="district-project-search-form__filters">
          <TextInput
            id="district-or-project-name"
            label={Drupal.t('Name of residential area or project', {}, { context: 'District and project search form label' })}
            placeholder={Drupal.t('For example, Pasila', {}, { context: 'District and project search form label' })}
            onChange={handleTitleChange}
            value={title}
            type='search'
          />
          <Select
            filter={defaultFilter}
            icon={<IconLocation />}
            id={SearchComponents.DISTRICTS}
            multiSelect
            open={districtSelectOpen}
            noTags
            onChange={(selectedOptions) => {
              setDistrictFilter(selectedOptions);
              setDistrictSelectOpen(true);
            }}
            onBlur={() => setDistrictSelectOpen(false)}
            options={districtOptions}
            theme={{
              '--checkbox-background-selected': 'var(--hdbt-color-black)',
              '--focus-outline-color': 'var(--hdbt-color-black)',
              '--placeholder-color': 'var(--hdbt-color-black)',
            }}
            texts={{
              clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': residentialAreaLabel}, { context: 'React search clear selection label' }),
              clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': residentialAreaLabel}, { context: 'React search clear selection label' }),
              label: residentialAreaLabel,
              placeholder: Drupal.t('All areas', {}, { context: 'District and project search form label' }),
            }}
            value={districtSelection}
          />
        </div>
        <Accordion
          className='district-project-search-form__additional-filters'
          headingLevel={3}
          heading={Drupal.t('Refine the project search', {}, { context: 'District and project search' })}
          initiallyOpen={accordionInitiallyOpen}
          language={window.drupalSettings.path.currentLanguage || 'fi'}
          size={AccordionSize.Small}
          theme={{
            '--header-font-size': 'var(--fontsize-heading-xxs)',
            '--header-line-height': 'var(--lineheight-s)',
          }}
        >
          <div className='district-project-search-form__filters'>
            <Select
              filter={defaultFilter}
              id={SearchComponents.THEME}
              multiSelect
              noTags
              open={themeSelectOpen}
              onChange={(selectedOptions) => {
                setThemeFilter(selectedOptions);
                setThemeSelectOpen(true);
              }}
              onBlur={() => setThemeSelectOpen(false)}
              options={themeOptions}
              theme={{
                '--checkbox-background-selected': 'var(--hdbt-color-black)',
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
              texts={{
                clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': projectThemeLabel}, { context: 'React search clear selection label' }),
                clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': projectThemeLabel}, { context: 'React search clear selection label' }),
                label: projectThemeLabel,
                placeholder: Drupal.t('All themes', {}, { context: 'District and project search form label' }),
              }}
              value={themeSelection}
            />
            <Select
              filter={defaultFilter}
              id={SearchComponents.PHASE}
              multiSelect
              noTags
              open={phaseSelectOpen}
              onChange={(selectedOptions) => {
                setPhaseFilter(selectedOptions);
                setPhaseSelectOpen(true);
              }}
              onBlur={() => setPhaseSelectOpen(false)}
              options={phaseOptions}
              theme={{
                '--checkbox-background-selected': 'var(--hdbt-color-black)',
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
              texts={{
                clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': projectStageLabel}, { context: 'React search clear selection label' }),
                clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': projectStageLabel}, { context: 'React search clear selection label' }),
                label: projectStageLabel,
                placeholder: Drupal.t('All stages', {}, { context: 'District and project search form label' }),
              }}
              value={phaseSelection}
            />
            <Select
              filter={defaultFilter}
              id={SearchComponents.TYPE}
              multiSelect
              noTags
              open={typeSelectOpen}
              onChange={(selectedOptions) => {
                setTypeFilter(selectedOptions);
                setTypeSelectOpen(true);
              }}
              onBlur={() => setTypeSelectOpen(false)}
              options={typeOptions}
              theme={{
                '--checkbox-background-selected': 'var(--hdbt-color-black)',
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
              texts={{
                clearButtonAriaLabel_one: Drupal.t('Clear @label selection', {'@label': projectTypeLabel}, { context: 'React search clear selection label' }),
                clearButtonAriaLabel_multiple: Drupal.t('Clear @label selection', {'@label': projectTypeLabel}, { context: 'React search clear selection label' }),
                label: projectTypeLabel,
                placeholder: Drupal.t('All types', {}, { context: 'District and project search form label' }),
              }}
              value={typeSelection}
            />
          </div>
        </Accordion>
        <div className='district-project-search-form__submit'>
          <Button
            className='district-project-search-form__submit-button'
            theme={ButtonPresetTheme.Black}
            type='submit'
            variant={ButtonVariant.Primary}
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

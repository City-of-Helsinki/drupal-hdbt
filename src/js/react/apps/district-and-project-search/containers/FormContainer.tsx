import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Accordion, IconLocation, Button, TextInput, Combobox } from 'hds-react';

import {
  urlAtom,
  urlUpdateAtom,
  titleAtom,
  districtsAtom,
  districtSelectionAtom,
  themesAtom,
  themeSelectionAtom,
  phasesAtom,
  phaseSelectionAtom,
  typesAtom,
  typeSelectionAtom
} from '../store';
import SelectionsContainer from './SelectionsContainer';
import SearchComponents from '../enum/SearchComponents';
import transformDropdownsValues from '../helpers/Params';
import { ComponentMap } from '../helpers/helpers';
import type OptionType from '../types/OptionType';
import URLParams from '../types/URLParams';

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
          />
          <Combobox
            multiselect
            id={SearchComponents.DISTRICTS}
            // @ts-ignore
            options={districtOptions}
            value={districtSelection}
            onChange={setDistrictFilter}
            icon={<IconLocation />}
            label={residentialAreaLabel}
            placeholder={Drupal.t('All areas', {}, { context: 'District and project search form label' })}
            clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': residentialAreaLabel }, { context: 'React search clear selection label' })}
            selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search remove item aria label' })}
            toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'React search open dropdown aria label' })}
            theme={{
              '--focus-outline-color': 'var(--hdbt-color-black)',
              '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
              '--placeholder-color': 'var(--hdbt-color-black)',
            }}
          />
        </div>
        <Accordion
          className='district-project-search-form__additional-filters'
          size='s'
          initiallyOpen={accordionInitiallyOpen}
          headingLevel={4}
          heading={Drupal.t('Refine the project search', {}, { context: 'District and project search' })}
          language={window.drupalSettings.path.currentLanguage || 'fi'}
          theme={{
            '--header-font-size': 'var(--fontsize-heading-xxs)',
            '--header-line-height': 'var(--lineheight-s)',
          }}
        >
          <div className='district-project-search-form__filters'>
            <Combobox
              multiselect
              id={SearchComponents.THEME}
              // @ts-ignore
              options={themeOptions}
              value={themeSelection}
              onChange={setThemeFilter}
              label={projectThemeLabel}
              placeholder={Drupal.t('All themes', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': projectThemeLabel }, { context: 'React search clear selection label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'React search open dropdown aria label' })}
              theme={{
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
            />
            <Combobox
              multiselect
              id={SearchComponents.PHASE}
              // @ts-ignore
              options={phaseOptions}
              value={phaseSelection}
              onChange={setPhaseFilter}
              label={projectStageLabel}
              placeholder={Drupal.t('All stages', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': projectStageLabel }, { context: 'React search clear selection label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'React search open dropdown aria label' })}
              theme={{
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
            />
            <Combobox
              multiselect
              id={SearchComponents.TYPE}
              // @ts-ignore
              options={typeOptions}
              value={typeSelection}
              onChange={setTypeFilter}
              label={projectTypeLabel}
              placeholder={Drupal.t('All types', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear @label selection', { '@label': projectTypeLabel }, { context: 'React search clear selection label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'React search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'React search open dropdown aria label' })}
              theme={{
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
            />
          </div>
        </Accordion>
        <div className='district-project-search-form__submit'>
          <Button
            className='district-project-search-form__submit-button'
            type='submit'
            variant='primary'
            theme='black'
          >
            {Drupal.t('Search', {}, { context: 'District and project search' })}
          </Button>
        </div>
        <SelectionsContainer />
      </div>
    </form>
  );
};

export default FormContainer;

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
import type OptionType from '../types/OptionType';


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

  return (
    <form onSubmit={handleSubmit}>
      <div className="district-project-search-form__filters-container">
        <div className="district-project-search-form__filters">
          <TextInput
            id="district-or-project-name"
            label={Drupal.t('Name of residential area or project', {}, { context: 'District and project search form label' })}
            placeholder={Drupal.t('Use a search word such as "Pasila"', {}, { context: 'District and project search form label' })}
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
            label={Drupal.t('Select the residential area from the list', {}, { context: 'District and project search form label' })}
            placeholder={Drupal.t('Select area', {}, { context: 'District and project search form label' })}
            clearButtonAriaLabel={Drupal.t('Clear selection', {}, { context: 'District and project search clear button aria label' })}
            selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'District and project search remove item aria label' })}
            toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'District and project search open dropdown aria label' })}
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
          initiallyOpen={!!new URLSearchParams(window.location.search).toString()}
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
              label={Drupal.t('Project theme', {}, { context: 'District and project search form label' })}
              placeholder={Drupal.t('All themes', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear selection', {}, { context: 'District and project search clear button aria label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'District and project search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'District and project search open dropdown aria label' })}
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
              label={Drupal.t('Project stage', {}, { context: 'District and project search form label' })}
              placeholder={Drupal.t('All stages', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear selection', {}, { context: 'District and project search clear button aria label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'District and project search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'District and project search open dropdown aria label' })}
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
              label={Drupal.t('Project type', {}, { context: 'District and project search form label' })}
              placeholder={Drupal.t('All types', {}, { context: 'District and project search form label' })}
              clearButtonAriaLabel={Drupal.t('Clear selection', {}, { context: 'District and project search clear button aria label' })}
              selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'District and project search remove item aria label' })}
              toggleButtonAriaLabel={Drupal.t('Open the combobox', {}, { context: 'District and project search open dropdown aria label' })}
              theme={{
                '--focus-outline-color': 'var(--hdbt-color-black)',
                '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
                '--placeholder-color': 'var(--hdbt-color-black)',
              }}
            />
          </div>
        </Accordion>
      </div>
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
    </form>
  );
};

export default FormContainer;

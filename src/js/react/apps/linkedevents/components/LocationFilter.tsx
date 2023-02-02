import { Select } from 'hds-react';
import { useAtomValue, useAtom } from 'jotai';

import { locationAtom, locationSelectionAtom, queryBuilderAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';


function LocationFilter() {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const locationOptions = useAtomValue(locationAtom);

  if (!queryBuilder || !locationOptions) {
    return null;
  }

  const locationHelper = Drupal.t('If you want to search for remote events, select only the option \'Internet (remote events)\'');

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        clearButtonAriaLabel={Drupal.t('Clear selections', {}, { context: 'Event search: clear button aria label' })}
        helper={locationHelper}
        label={Drupal.t('Select a venue')}
        multiselect
        // @ts-ignore
        options={locationOptions}
        value={locationSelection}
        id={SearchComponents.LOCATION}
        onChange={setLocationFilter}
        placeholder={Drupal.t('All', {}, { context: 'Event search: all available options' })}
        selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item', {}, { context: 'Event search: remove item aria label' })}
        theme={{
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
      />
    </div>
  );
}

export default LocationFilter;

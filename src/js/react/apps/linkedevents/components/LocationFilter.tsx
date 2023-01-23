import { Select } from 'hds-react';

import { useAtomValue } from 'jotai';
import ApiKeys from '../enum/ApiKeys';
import { locationsAtom, queryBuilderAtom } from '../store';

function LocationFilter() {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const locationOptions = useAtomValue(locationsAtom);

  if (!queryBuilder || !locationOptions) {
    return null;
  }

  const onChange = (value: any) => {
    queryBuilder.setParams({ [ApiKeys.LOCATION]: value.map((location: any) => location.value).join(',') });
  };

  const locationHelper = Drupal.t('If you want to search for remote events, select only the option \'Internet (remote events)\'');

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        clearButtonAriaLabel={Drupal.t('Clear selections', {}, { context: 'Event search: clear button aria label' })}
        helper={locationHelper}
        label={Drupal.t('Select a venue')}
        multiselect
        onChange={onChange}
        options={locationOptions || []}
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

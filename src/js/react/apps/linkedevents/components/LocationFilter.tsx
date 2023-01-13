import { Select } from 'hds-react';

import type Location from '../types/Location';
import { QueryBuilder } from '../utils/QueryBuilder';
import ApiKeys from '../enum/ApiKeys';

type LocationFilterProps = {
  loading: boolean,
  options: Location[],
  queryBuilder: QueryBuilder
};

function LocationFilter({ loading, options, queryBuilder }: LocationFilterProps) {
  const onChange = (value: any) => {
    queryBuilder.setParams({ [ApiKeys.LOCATION]: value.map((location: Location) => location.value).join(',') });
  };

  const locationHelper = Drupal.t('If you want to search for remote events, select only the option \'Internet (remote events)\'');

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        clearButtonAriaLabel={Drupal.t('Clear selections', {}, { context: 'Event search: clear button aria label' })}
        disabled={loading}
        helper={locationHelper}
        label={Drupal.t('Select a venue')}
        multiselect
        onChange={onChange}
        options={options}
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

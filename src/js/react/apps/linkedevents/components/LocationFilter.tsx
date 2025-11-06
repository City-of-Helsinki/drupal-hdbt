import { Select } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import {
  locationAtom,
  locationSelectionAtom,
  updateParamsAtom,
} from '../store';
import type OptionType from '../types/OptionType';

function LocationFilter() {
  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationFilter] = useAtom(locationSelectionAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const onChange = (selectedOptions: OptionType[]) => {
    setLocationFilter(selectedOptions);
    updateParams({
      [ApiKeys.LOCATION]: selectedOptions
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
        .map((location: any) => location.value)
        .join(','),
    });
  };

  const selectVenueLabel: string = Drupal.t(
    'Venue',
    {},
    { context: 'Events search' },
  );

  return (
    <div className='hdbt-search__filter event-form__filter--location'>
      <Select
        className='hdbt-search__dropdown'
        id={SearchComponents.LOCATION}
        multiSelect
        noTags
        onChange={onChange}
        options={locationOptions}
        texts={{
          label: selectVenueLabel,
          language: getCurrentLanguage(
            window.drupalSettings.path.currentLanguage,
          ),
          placeholder: Drupal.t(
            'All venues',
            {},
            { context: 'React search: all available options' },
          ),
        }}
        theme={defaultMultiSelectTheme}
        value={locationSelection}
      />
    </div>
  );
}

export default LocationFilter;

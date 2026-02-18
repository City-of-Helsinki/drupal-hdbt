import type { DateTime } from 'luxon';
import { updateDatesAtom } from '../../../store';
import { getDefaultSelectTexts } from '@/react/common/helpers/Texts';
import { type Option, Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { startDateAtom } from '../store';

export const StartDateFilter = ({
  dateOptions,
}: {
  dateOptions: Map<string, { start?: DateTime; end?: DateTime }>;
}) => {
  const updateDates = useSetAtom(updateDatesAtom);
  const [value, setValue] = useAtom(startDateAtom);

  const handleChange = (selections: Option[]) => {
    if (!selections.length) {
      updateDates({
        end: undefined,
        start: undefined,
      });
      setValue([]);
      return;
    }

    const selectedValue = selections[0].value;
    const dateOption = dateOptions.get(selectedValue);

    if (!dateOption) {
      throw new Error(`No date option found for value: ${selectedValue}`);
    }

    setValue(selections);
    updateDates({
      end: dateOption.end,
      start: dateOption.start,
    });
  };

  const languageLabel = Drupal.t('Start time', {}, { context: 'Cross-institutional studies: start time filter label' });
  const options = Array.from(dateOptions.keys()).map((label) => ({ label, value: label }));

  return (
    <div className='hdbt-search__filter'>
      <Select
        className='hdbt-search__dropdown'
        clearable
        id='start-date-select'
        onChange={(selectedOptions) => handleChange(selectedOptions)}
        options={options}
        value={value}
        noTags
        texts={{
          ...getDefaultSelectTexts(languageLabel),
          placeholder: Drupal.t(
            'All start times',
            {},
            { context: 'Cross-institutional studies: start time filter placeholder' },
          ),
        }}
      />
    </div>
  );
};

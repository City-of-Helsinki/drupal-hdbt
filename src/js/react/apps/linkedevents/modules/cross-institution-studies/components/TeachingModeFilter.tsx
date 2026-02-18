import { type Option, Select } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { updateParamsAtom } from '../../../store';
import ApiKeys from '../../../enum/ApiKeys';
import { getDefaultSelectTexts } from '@/react/common/helpers/Texts';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { teachingModeAtom } from '../store';
import { TeachingModes } from '../../enum/TeachingModes';

export const TeachingModeFilter = () => {
  const [value, setValue] = useAtom(teachingModeAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const handleChange = (selectedOptions: Option[]) => {
    setValue(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    updateParams({ [ApiKeys.KEYWORDS]: selectedValues.join(',') });
  };

  return (
    <div className='hdbt-search__filter'>
      <Select
        className='hdbt-search__dropdown'
        id='teaching-mode-filter'
        multiSelect
        noTags
        onChange={handleChange}
        options={[...TeachingModes]
          .map(([value, label]) => ({ value, label }))
          .toSorted((a, b) => a.label.localeCompare(b.label))}
        texts={{
          ...getDefaultSelectTexts(
            Drupal.t('Mode of teaching', {}, { context: 'Cross-institutional studies: Teaching mode filter label' }),
          ),
          placeholder: Drupal.t(
            'All modes of teaching',
            {},
            { context: 'Cross-institutional studies: Teaching mode filter placeholder' },
          ),
        }}
        theme={defaultMultiSelectTheme}
        value={value}
      />
    </div>
  );
};

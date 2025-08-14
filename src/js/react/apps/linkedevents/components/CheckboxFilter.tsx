import { Checkbox } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';

import { resetParamAtom, updateParamsAtom } from '../store';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';

type CheckboxFilterProps = {
  id: string;
  label: string;
  atom: any;
  valueKey: string;
};

function CheckboxFilter({ id, label, atom, valueKey }: CheckboxFilterProps) {
  const [value, setValue] = useAtom(atom);
  const resetParam = useSetAtom(resetParamAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const toggleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.checked) {
      setValue(false);
      resetParam(valueKey);
      return;
    }

    setValue(true);
    updateParams({ [valueKey]: 'true' });
  };

  let checked = false;
  if (value) {
    checked = true;
  }

  return (
    <Checkbox
      checked={checked}
      className="hdbt-search--react__checkbox"
      id={id}
      label={label}
      onChange={(event) => toggleValue(event)}
      style={defaultCheckboxStyle}
    />
  );
}

export default CheckboxFilter;

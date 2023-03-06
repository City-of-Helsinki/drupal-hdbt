import { Checkbox } from 'hds-react';
import { SetStateAction, WritableAtom, useAtom, useSetAtom } from 'jotai';

import { resetParamAtom, updateParamsAtom } from '../store';

type CheckboxFilterProps = {
  id: string;
  label: string;
  atom: WritableAtom<boolean, SetStateAction<boolean>, void>;
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

  return (
    <Checkbox
      checked={value || false}
      className="hdbt-search__filter hdbt-search__checkbox"
      id={id}
      label={label}
      onChange={(event) => toggleValue(event)}
    />
  );
}

export default CheckboxFilter;

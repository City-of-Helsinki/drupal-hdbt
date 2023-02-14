import { Checkbox } from 'hds-react';
import { SetStateAction, WritableAtom, useAtomValue, useAtom } from 'jotai';

import { queryBuilderAtom } from '../store';

type CheckboxFilterProps = {
  id: string;
  label: string;
  atom: WritableAtom<boolean, SetStateAction<boolean>, void>;
  valueKey: string;
};

function CheckboxFilter({ id, label, atom, valueKey }: CheckboxFilterProps) {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const [value, setValue] = useAtom(atom);

  if (!queryBuilder) {
    return null;
  }

  const toggleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.checked) {
      setValue(false);
      queryBuilder.resetParam(valueKey);
      return;
    }

    setValue(true);
    queryBuilder.setParams({ [valueKey]: 'true' });
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

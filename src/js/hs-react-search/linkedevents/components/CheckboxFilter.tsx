// import { Checkbox } from 'hds-react';

type CheckboxFilterProps = {
  checked: boolean;
  id: string;
  label: string;
  onChange: Function;
}

const CheckboxFilter = ({ checked, id, label, onChange }: CheckboxFilterProps) => {
  return (<span/>);
  //   <Checkbox
  //     checked={checked}
  //     className={'hdbt-search__filter hdbt-search__checkbox'}
  //     id={id}
  //     label={label}
  //     onChange={(event) => onChange(event)}
  //   />
  // );
}

export default CheckboxFilter;

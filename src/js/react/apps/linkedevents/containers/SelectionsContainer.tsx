import { MouseEventHandler, memo } from 'react';
import { SetStateAction, WritableAtom, useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';

import {
  resetFormAtom,
  locationAtom,
  locationSelectionAtom,
  queryBuilderAtom,
  urlAtom,
  freeFilterAtom,
  remoteFilterAtom,
  startDateAtom,
  endDisabledAtom,
} from '../store';
import OptionType from '../types/OptionType';
import ApiKeys from '../enum/ApiKeys';

type SelectionsContainerProps = {
  submitValue: number;
};

const SelectionsContainer = ({ submitValue }: SelectionsContainerProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const freeFilter = useAtomValue(freeFilterAtom);
  const remoteFilter = useAtomValue(remoteFilterAtom);
  const locationOptions = useAtomValue(locationAtom);
  // const startDate = useAtomValue(startDateAtom);
  // const endDate = useAtomValue(endDisabledAtom);
  const [locationSelection, setLocationSelection] = useAtom(locationSelectionAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const setUrl = useSetAtom(urlAtom);

  const showClearButton =  locationSelection.length || freeFilter || remoteFilter;

  if (!queryBuilder) {
    return null;
  }

  const resetFormm = () => {
    queryBuilder.reset();
    setUrl(queryBuilder.updateUrl());
    resetForm();
  };

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        {locationOptions && (
          <ListFilter
            updater={setLocationSelection}
            valueKey={ApiKeys.LOCATION}
            values={locationSelection}
          />
        )}
        {remoteFilter && (
          <CheckboxFilterPill
            label={Drupal.t('Remote events')}
            valueKey={ApiKeys.REMOTE}
            atom={remoteFilterAtom}
          />
        )}
        {freeFilter && (
          <CheckboxFilterPill
            label={Drupal.t('Free-of-charge events')}
            valueKey={ApiKeys.FREE}
            atom={freeFilterAtom}
          />
        )}

        <li className='hdbt-search__clear-all'>
          <Button
            aria-hidden={showClearButton ? 'true' : 'false'}
            className='hdbt-search__clear-all-button'
            iconLeft={<IconCross className='hdbt-search__clear-all-icon' />}
            onClick={resetFormm}
            style={showClearButton ? {} : { visibility: 'hidden' }}
            variant='supplementary'
          >
            {Drupal.t('Clear selections', {}, { context: 'React search clear selections' })}
          </Button>
        </li>
      </ul>
    </div>
  );
};

const updateSelections = (prev: SelectionsContainerProps, next: SelectionsContainerProps) => {
  if (prev.submitValue === next.submitValue) {
    return true;
  }

  return false;
};

export default memo(SelectionsContainer, updateSelections);


type ListFilterProps = {
  updater: Function;
  valueKey: string;
  values: OptionType[];
};

const ListFilter = ({ updater, values, valueKey }: ListFilterProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder) {
    return null;
  }

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex((selection: OptionType) => selection.value === value);
    newValue.splice(index, 1);
    updater(newValue);
    queryBuilder.setParams({ [ApiKeys.LOCATION]: newValue.map((location: any) => location.value).join(',') });
    setUrl(queryBuilder.updateUrl());
  };

  return (
    <>
      {values.map((selection: OptionType) => (
        <FilterButton
          value={selection.simpleLabel || selection.label}
          clearSelection={() => removeSelection(selection.value)}
          key={selection.value}
        />
      ))}
    </>
  );
};

type CheckboxFilterPillProps = {
  atom: WritableAtom<boolean, SetStateAction<boolean>, void>;
  valueKey: string;
  label: string;
};

const CheckboxFilterPill = ({ atom, valueKey, label }: CheckboxFilterPillProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setValue = useSetAtom(atom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder) {
    return null;
  }

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        setValue(false);
        queryBuilder.resetParam(valueKey);
        setUrl(queryBuilder.updateUrl());
      }}
    />
  );
};

// type SingleFilterProps = {
//   atom: WritableAtom<OptionType | null, SetStateAction<OptionType | null>, void>;
//   valueKey: string;
//   label: string;
// };

// const SingleFilter = ({ atom, valueKey, label }: SingleFilterProps) => {
//   const setValue = useSetAtom(atom);
//   // const urlParams = useAtomValue(urlAtom);
//   // const setUrlParams = useSetAtom(urlUpdateAtom);

//   // const { language, ...updatedParams } = urlParams;

//   return (
//     <FilterButton
//       value={label}
//       clearSelection={() => {
//         // setUrlParams(updatedParams);
//         setValue(null);
//       }}
//     />
//   );
// };

type FilterButtonProps = {
  value: string;
  // clearSelection: MouseEventHandler<HTMLLIElement>;
  clearSelection: MouseEventHandler<HTMLButtonElement>;
};

const FilterButton = ({ value, clearSelection }: FilterButtonProps) => (
  <li
    className='content-tags__tags__tag content-tags__tags--interactive'
    key={`test${  value.toString()}`}
    // onClick={clearSelection}
  >
    <Button
      aria-label={Drupal.t(
        'Remove @item from search results',
        { '@item': value.toString() },
        { context: 'Search: remove item aria label' }
      )}
      className='hdbt-search__remove-selection-button'
      iconRight={<IconCross />}
      variant='supplementary'
      onClick={clearSelection}
    >
      {value}
    </Button>
  </li>
);

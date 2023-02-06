import { MouseEventHandler } from 'react';
import { SetStateAction, WritableAtom, useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';

import SearchComponents from '../enum/SearchComponents';
import {
  resetFormAtom,
  locationAtom,
  locationSelectionAtom,
  queryBuilderAtom,
  urlAtom
} from '../store';
import OptionType from '../types/OptionType';
import ApiKeys from '../enum/ApiKeys';


const SelectionsContainer = () => {
  const resetForm = useSetAtom(resetFormAtom);
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setUrl = useSetAtom(urlAtom);

  const locationOptions = useAtomValue(locationAtom);
  const [locationSelection, setLocationSelection] = useAtom(locationSelectionAtom);

  const showClearButton =  locationSelection.length;

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
            valueKey={SearchComponents.LOCATION}
            values={locationSelection}
          />
        )}
        {/* {urlParams.youth_summer_jobs && (
          <CheckboxFilterPill
            label={Drupal.t('Summer jobs for young people', {}, { context: 'Job search' })}
            atom={youthSummerJobsAtom}
            valueKey={SearchComponents.YOUTH_SUMMER_JOBS}
          />
        )} */}
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

export default SelectionsContainer;

type ListFilterProps = {
  updater: Function;
  valueKey: string;
  values: OptionType[];
};

const ListFilter = ({ updater, values, valueKey }: ListFilterProps) => {
  // const urlParams = useAtomValue(urlAtom);
  // const setUrlParams = useSetAtom(urlUpdateAtom);
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
    // setUrlParams({
    //   ...urlParams,
    //   [valueKey]: newValue.map((selection: OptionType) => selection.value),
    // });
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
  const setValue = useSetAtom(atom);
  // const urlParams = useAtomValue(urlAtom);
  // const setUrlParams = useSetAtom(urlUpdateAtom);

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        // setUrlParams({ ...urlParams, [valueKey]: false });
        setValue(false);
      }}
    />
  );
};

type SingleFilterProps = {
  atom: WritableAtom<OptionType | null, SetStateAction<OptionType | null>, void>;
  valueKey: string;
  label: string;
};

const SingleFilter = ({ atom, valueKey, label }: SingleFilterProps) => {
  const setValue = useSetAtom(atom);
  // const urlParams = useAtomValue(urlAtom);
  // const setUrlParams = useSetAtom(urlUpdateAtom);

  // const { language, ...updatedParams } = urlParams;

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        // setUrlParams(updatedParams);
        setValue(null);
      }}
    />
  );
};

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

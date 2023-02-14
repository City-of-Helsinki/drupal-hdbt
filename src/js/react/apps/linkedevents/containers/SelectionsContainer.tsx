import { MouseEventHandler, memo } from 'react';
import { SetStateAction, WritableAtom, useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';
import type { DateTime } from 'luxon';

import {
  resetFormAtom,
  locationSelectionAtom,
  queryBuilderAtom,
  urlAtom,
  freeFilterAtom,
  remoteFilterAtom,
  startDateAtom,
  endDateAtom,
} from '../store';
import OptionType from '../types/OptionType';
import ApiKeys from '../enum/ApiKeys';
import getDateString from '../helpers/GetDate';

type SelectionsContainerProps = {
  url: string | null;
};

const SelectionsContainer = ({ url }: SelectionsContainerProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const freeFilter = useAtomValue(freeFilterAtom);
  const remoteFilter = useAtomValue(remoteFilterAtom);
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const [locationSelection, setLocationSelection] = useAtom(locationSelectionAtom);

  const showClearButton = locationSelection.length || startDate || endDate || freeFilter || remoteFilter;

  if (!queryBuilder || !url) {
    return null;
  }

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        <ListFilterr
          updater={setLocationSelection}
          valueKey={ApiKeys.LOCATION}
          values={locationSelection}
          url={url}
        />
        <DateFilterPilll
          startDate={startDate}
          endDate={endDate}
          url={url}
        />
        <CheckboxFilterPilll
          label={Drupal.t('Remote events')}
          valueKey={ApiKeys.REMOTE}
          atom={remoteFilterAtom}
          url={url}
          value={remoteFilter}
        />
        <CheckboxFilterPilll
          label={Drupal.t('Free-of-charge events')}
          valueKey={ApiKeys.FREE}
          atom={freeFilterAtom}
          url={url}
          value={freeFilter}
        />
        <ClearButtonn showClearButton={showClearButton} url={url} />
      </ul>
    </div>
  );
};

type ListFilterProps = {
  updater: Function;
  valueKey: string;
  values: OptionType[];
  url: string | null;
};

const ListFilter = ({ updater, values, valueKey, url }: ListFilterProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder || !values.length) {
    return null;
  }

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex((selection: OptionType) => selection.value === value);
    newValue.splice(index, 1);
    updater(newValue);
    queryBuilder.setParams({ [valueKey]: newValue.map((v: any) => v.value).join(',') });
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
  url: string | null;
  value: boolean;
};

const CheckboxFilterPill = ({ atom, valueKey, label, url, value }: CheckboxFilterPillProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setValue = useSetAtom(atom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder || !value) {
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

type DateFilterPillProps = {
  startDate: DateTime | undefined;
  endDate: DateTime | undefined;
  url: string | null;
};

const DateFilterPill = ({ startDate, endDate, url}: DateFilterPillProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const setUrl = useSetAtom(urlAtom);
  const setStartDate = useSetAtom(startDateAtom);
  const setEndDate = useSetAtom(endDateAtom);

  if (!queryBuilder || !startDate && !endDate) {
    return null;
  }

  return (
    <FilterButton
      value={getDateString({ startDate, endDate })}
      clearSelection={() => {
        setStartDate(undefined);
        setEndDate(undefined);
        queryBuilder.resetParam('start');
        queryBuilder.resetParam('end');
        setUrl(queryBuilder.updateUrl());
      }}
    />
  );
};

type FilterButtonProps = {
  value: string;
  clearSelection: MouseEventHandler<HTMLButtonElement>;
};

const FilterButton = ({ value, clearSelection }: FilterButtonProps) => (
  <li
    className='content-tags__tags__tag content-tags__tags--interactive'
    key={`${value.toString()}`}
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

type ClearButtonProps = {
  showClearButton: number | boolean | DateTime;
  url: string | null;
};


const ClearButton = ({ showClearButton, url }: ClearButtonProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const resetFormStore = useSetAtom(resetFormAtom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder) {
    return null;
  }

  const resetForm = () => {
    resetFormStore();
    queryBuilder.reset();
    setUrl(queryBuilder.updateUrl());
  };

  return (
    <li className='hdbt-search__clear-all'>
      <Button
        aria-hidden={showClearButton ? 'true' : 'false'}
        className='hdbt-search__clear-all-button'
        iconLeft={<IconCross className='hdbt-search__clear-all-icon' />}
        onClick={resetForm}
        style={showClearButton ? {} : { visibility: 'hidden' }}
        variant='supplementary'
      >
        {Drupal.t('Clear selections', {}, { context: 'React search clear selections' })}
      </Button>
    </li>
  );
};

const updateSelections = (prev: any, next: any) => {
  if (prev.url === next.url) {
    return true;
  }

  return false;
};

const ListFilterr = memo(ListFilter, updateSelections);
const CheckboxFilterPilll = memo(CheckboxFilterPill, updateSelections);
const DateFilterPilll = memo(DateFilterPill, updateSelections);
const ClearButtonn = memo(ClearButton, updateSelections);
export default memo(SelectionsContainer, updateSelections);

import { MouseEventHandler, memo } from 'react';
import { SetStateAction, WritableAtom, useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button, IconCross } from 'hds-react';
import type { DateTime } from 'luxon';

import {
  resetFormAtom,
  locationSelectionAtom,
  freeFilterAtom,
  remoteFilterAtom,
  startDateAtom,
  endDateAtom,
  resetParamAtom,
  updateParamsAtom,
  updateUrlAtom,
} from '../store';
import OptionType from '../types/OptionType';
import ApiKeys from '../enum/ApiKeys';
import getDateString from '../helpers/GetDate';

type SelectionsContainerProps = {
  url: string | undefined;
};

const SelectionsContainer = ({ url }: SelectionsContainerProps) => {
  const freeFilter = useAtomValue(freeFilterAtom);
  const remoteFilter = useAtomValue(remoteFilterAtom);
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const [locationSelection, setLocationSelection] = useAtom(locationSelectionAtom);

  const showClearButton = locationSelection.length || startDate || endDate || freeFilter || remoteFilter;

  if (!url) {
    return null;
  }

  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>
        <ListFilterPills
          updater={setLocationSelection}
          valueKey={ApiKeys.LOCATION}
          values={locationSelection}
          url={url}
        />
        <DateFilterPill
          startDate={startDate}
          endDate={endDate}
          url={url}
        />
        <CheckboxFilterPill
          label={Drupal.t('Remote events')}
          valueKey={ApiKeys.REMOTE}
          atom={remoteFilterAtom}
          url={url}
          value={remoteFilter}
        />
        <CheckboxFilterPill
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

type ListFilterBulletsProps = {
  updater: Function;
  valueKey: string;
  values: OptionType[];
  url: string | null;
};

const ListFilterBullets = ({ updater, values, valueKey, url }: ListFilterBulletsProps) => {
  const updateParams = useSetAtom(updateParamsAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  if (!values.length) {
    return null;
  }

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex((selection: OptionType) => selection.value === value);
    newValue.splice(index, 1);
    updater(newValue);
    updateParams({ [valueKey]: newValue.map((v: any) => v.value).join(',') });
    updateUrl();
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

type CheckboxFilterBulletProps = {
  atom: WritableAtom<boolean, SetStateAction<boolean>, void>;
  valueKey: string;
  label: string;
  url: string | null;
  value: boolean;
};

const CheckboxFilterBullet = ({ atom, valueKey, label, url, value }: CheckboxFilterBulletProps) => {
  const setValue = useSetAtom(atom);
  const resetParam = useSetAtom(resetParamAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  if (!value) {
    return null;
  }

  return (
    <FilterButton
      value={label}
      clearSelection={() => {
        setValue(false);
        resetParam(valueKey);
        updateUrl();
      }}
    />
  );
};

type DateFilterBulletProps = {
  startDate: DateTime | undefined;
  endDate: DateTime | undefined;
  url: string | null;
};

const DateFilterBullet = ({ startDate, endDate, url}: DateFilterBulletProps) => {
  const setStartDate = useSetAtom(startDateAtom);
  const setEndDate = useSetAtom(endDateAtom);
  const resetParam = useSetAtom(resetParamAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  if (!startDate && !endDate) {
    return null;
  }

  return (
    <FilterButton
      value={getDateString({ startDate, endDate })}
      clearSelection={() => {
        setStartDate(undefined);
        setEndDate(undefined);
        resetParam('start');
        resetParam('end');
        updateUrl();
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
  const resetFormStore = useSetAtom(resetFormAtom);

  const resetForm = () => {
    resetFormStore();
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

const ListFilterPills = memo(ListFilterBullets, updateSelections);
const CheckboxFilterPill = memo(CheckboxFilterBullet, updateSelections);
const DateFilterPill = memo(DateFilterBullet, updateSelections);
const ClearButtonn = memo(ClearButton, updateSelections);
export default memo(SelectionsContainer, updateSelections);

import { MouseEventHandler, memo, ReactNode } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import type { DateTime } from 'luxon';

import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import FilterButton from '@/react/common/FilterButton';
import {
  resetFormAtom,
  locationSelectionAtom,
  topicSelectionAtom,
  freeFilterAtom,
  remoteFilterAtom,
  startDateAtom,
  endDateAtom,
  resetParamAtom,
  updateParamsAtom,
  updateUrlAtom,
  settingsAtom,
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
  const [topicsSelection, setTopicsSelection] = useAtom(topicSelectionAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const settings = useAtomValue(settingsAtom);
  const {
    showTopicsFilter,
    showLocation,
    showTimeFilter,
    useFullLocationFilter,
    useFullTopicsFilter,
  } = settings;

  const showClearButton = locationSelection.length || topicsSelection.length || startDate || endDate || freeFilter || remoteFilter;

  if (!url) {
    return null;
  }

  return (
    <FilterBulletsWrapper showClearButton={showClearButton} resetForm={resetForm} url={url}>
      {
        (showTopicsFilter && !useFullTopicsFilter) &&
        <ListFilterPills
          updater={setTopicsSelection}
          valueKey={ApiKeys.KEYWORDS}
          values={topicsSelection}
          url={url}
        />
      }
      {
        (showLocation && !useFullLocationFilter) &&
        <ListFilterPills
          updater={setLocationSelection}
          valueKey={ApiKeys.LOCATION}
          values={locationSelection}
          url={url}
        />
      }
      <DateFilterPill
        startDate={startDate}
        endDate={endDate}
        url={url}
      />
      <CheckboxFilterPill
        label={Drupal.t('Remote events', {}, { context: 'Events search' })}
        valueKey={ApiKeys.REMOTE}
        atom={remoteFilterAtom}
        url={url}
        value={remoteFilter}
      />
      <CheckboxFilterPill
        label={Drupal.t('Free-of-charge events', {}, { context: 'Events search' })}
        valueKey={ApiKeys.FREE}
        atom={freeFilterAtom}
        url={url}
        value={freeFilter}
      />
    </FilterBulletsWrapper>
  );
};

type FilterBulletsProps = {
  showClearButton: string | number | boolean | true | DateTime |undefined;
  resetForm: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  url: string | null;
};

const FilterBullets = ({ showClearButton, resetForm, children, url }: FilterBulletsProps) => (
  <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
    {children}
  </SelectionsWrapper>
);

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
  atom: any;
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

const updateSelections = (prev: any, next: any) => {
  if (prev.url === next.url) {
    return true;
  }

  return false;
};

const FilterBulletsWrapper = memo(FilterBullets, updateSelections);
const ListFilterPills = memo(ListFilterBullets, updateSelections);
const CheckboxFilterPill = memo(CheckboxFilterBullet, updateSelections);
const DateFilterPill = memo(DateFilterBullet, updateSelections);
export default memo(SelectionsContainer, updateSelections);

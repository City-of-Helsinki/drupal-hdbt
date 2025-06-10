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
  languageAtom,
  eventTypeAtom,
} from '../store';
import OptionType from '../types/OptionType';
import ApiKeys from '../enum/ApiKeys';
import getDateString from '../helpers/GetDate';
import { EventTypeOption } from '../types/EventTypeOption';
import { typeSelectionsToString } from '../helpers/TypeSelectionsToString';

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
  const [languageSelection, setLanguageSelection] = useAtom(languageAtom);
  const eventTypeSelection = useAtomValue(eventTypeAtom);
  const resetForm = useSetAtom(resetFormAtom);

  const showClearButton =
    locationSelection.length ||
    topicsSelection.length ||
    languageSelection.length ||
    eventTypeSelection.length ||
    startDate ||
    endDate ||
    freeFilter ||
    remoteFilter;

  if (!url) {
    return null;
  }

  return (
    <FilterBulletsWrapper showClearButton={showClearButton} resetForm={resetForm} url={url}>
      <ListFilterPills
        updater={setTopicsSelection}
        valueKey={ApiKeys.KEYWORDS}
        values={topicsSelection}
        url={url}
      />
      <ListFilterPills
        updater={setLocationSelection}
        valueKey={ApiKeys.LOCATION}
        values={locationSelection}
        url={url}
      />
      <ListFilterPills
        updater={setLanguageSelection}
        valueKey={ApiKeys.LANGUAGE}
        values={languageSelection}
        url={url}
      />
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
      <TypeFilterPills {...{eventTypeSelection, url}}/>
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

    const event = new Event(`eventsearch-clear-${valueKey}`);
    window.dispatchEvent(event);
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

const TypeFilterBullets = ({
  eventTypeSelection,
  url,
}: {
  eventTypeSelection: EventTypeOption[];
  url: string|null;
}) => {
  const setEventTypeSelection = useSetAtom(eventTypeAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  if (!eventTypeSelection.length) {
    return null;
  }

  return (
    <>
      {eventTypeSelection.map((selection: EventTypeOption) => (
        <FilterButton
          clearSelection={() => {
            const value = eventTypeSelection.filter((type) => type !== selection);
            setEventTypeSelection(value);
            updateParams({[ApiKeys.EVENT_TYPE]: typeSelectionsToString(value)});
            updateUrl();
          }}
          key={selection}
          value={selection === 'General' ?
            Drupal.t('Events', {}, {context: 'Event search: events type'}) :
            Drupal.t('Hobbies', {}, {context: 'Event search: hobbies type'})
          }
        />
      ))}
    </>
  );
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
const TypeFilterPills = memo(TypeFilterBullets, updateSelections);
export default memo(SelectionsContainer, updateSelections);

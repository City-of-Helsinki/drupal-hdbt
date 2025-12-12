// biome-ignore-all lint/correctness/noUnusedFunctionParameters: @todo UHF-12501
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { DateTime } from 'luxon';
import { type MouseEventHandler, memo, type ReactNode } from 'react';
import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import ApiKeys from '../enum/ApiKeys';
import getDateString from '../helpers/GetDate';
import { targetGroupsToParams } from '../helpers/TargetGroupsToParams';
import { typeSelectionsToString } from '../helpers/TypeSelectionsToString';
import {
  endDateAtom,
  eventTypeAtom,
  freeFilterAtom,
  languageAtom,
  loadableUrlAtom,
  locationSelectionAtom,
  remoteFilterAtom,
  resetFormAtom,
  resetParamAtom,
  startDateAtom,
  targetGroupsAtom,
  topicSelectionAtom,
  updateParamsAtom,
  updateUrlAtom,
} from '../store';
import type { EventTypeOption } from '../types/EventTypeOption';
import type OptionType from '../types/OptionType';

const SelectionsContainer = () => {
  const [urlData] = useAtom(loadableUrlAtom);
  const freeFilter = useAtomValue(freeFilterAtom);
  const remoteFilter = useAtomValue(remoteFilterAtom);
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const [locationSelection, setLocationSelection] = useAtom(locationSelectionAtom);
  const [topicsSelection, setTopicsSelection] = useAtom(topicSelectionAtom);
  const targetGroups = useAtomValue(targetGroupsAtom);
  const [languageSelection, setLanguageSelection] = useAtom(languageAtom);
  const eventTypeSelection = useAtomValue(eventTypeAtom);
  const resetForm = useSetAtom(resetFormAtom);

  const showClearButton =
    eventTypeSelection.length ||
    languageSelection.length ||
    locationSelection.length ||
    targetGroups.length ||
    topicsSelection.length ||
    endDate ||
    freeFilter ||
    remoteFilter ||
    startDate;

  // Check if data is available
  if (urlData.state !== 'hasData' || !urlData.data) {
    return null;
  }

  return (
    <FilterBulletsWrapper showClearButton={showClearButton} resetForm={resetForm} url={urlData.data}>
      <ListFilterPills
        updater={setTopicsSelection}
        valueKey={ApiKeys.KEYWORDS}
        values={topicsSelection}
        url={urlData.data}
      />
      <TargetGroupPills targetGroups={targetGroups} url={urlData.data} />
      <ListFilterPills
        updater={setLocationSelection}
        valueKey={ApiKeys.LOCATION}
        values={locationSelection}
        url={urlData.data}
      />
      <ListFilterPills
        updater={setLanguageSelection}
        valueKey={ApiKeys.LANGUAGE}
        values={languageSelection}
        url={urlData.data}
      />
      <DateFilterPill startDate={startDate} endDate={endDate} url={urlData.data} />
      <CheckboxFilterPill
        label={Drupal.t('Remote events', {}, { context: 'Events search' })}
        valueKey={ApiKeys.REMOTE}
        atom={remoteFilterAtom}
        url={urlData.data}
        value={remoteFilter}
      />
      <CheckboxFilterPill
        label={Drupal.t('Free-of-charge events', {}, { context: 'Events search' })}
        valueKey={ApiKeys.FREE}
        atom={freeFilterAtom}
        url={urlData.data}
        value={freeFilter}
      />
      <TypeFilterPills {...{ eventTypeSelection }} url={urlData.data} />
    </FilterBulletsWrapper>
  );
};

type FilterBulletsProps = {
  showClearButton: string | number | boolean | true | DateTime | undefined;
  resetForm: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  url: string | null;
};

const FilterBullets = ({ showClearButton, resetForm, children, url }: FilterBulletsProps) => {
  // SelectionWrapper hasContent doesn't work for this, we need to bind the check to
  // showClearButton which checks if any of the filters have values
  if (!showClearButton) {
    return null;
  }

  return (
    <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
      {children}
    </SelectionsWrapper>
  );
};

type ListFilterBulletsProps = {
  // biome-ignore lint/complexity/noBannedTypes: @todo UHF-12501
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
    // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
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
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
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

type DateFilterBulletProps = { startDate: DateTime | undefined; endDate: DateTime | undefined; url: string | null };

const TypeFilterBullets = ({
  eventTypeSelection,
  url,
}: {
  eventTypeSelection: EventTypeOption[];
  url: string | null;
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
            updateParams({ [ApiKeys.EVENT_TYPE]: typeSelectionsToString(value) });
            updateUrl();
          }}
          key={selection}
          value={
            selection === 'General'
              ? Drupal.t('Events', {}, { context: 'Event search: events type' })
              : Drupal.t('Hobbies', {}, { context: 'Event search: hobbies type' })
          }
        />
      ))}
    </>
  );
};

const DateFilterBullet = ({ startDate, endDate, url }: DateFilterBulletProps) => {
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

const TargetGroupsBullets = ({ targetGroups, url }: { targetGroups: OptionType[]; url: string | null }) => {
  const setTargetGroups = useSetAtom(targetGroupsAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  if (!targetGroups.length) {
    return null;
  }

  return (
    <>
      {targetGroups.map((selection: OptionType) => (
        <FilterButton
          clearSelection={() => {
            const value = targetGroups.filter((targetGroup) => targetGroup.value !== selection.value);
            setTargetGroups(value);
            updateParams(targetGroupsToParams(value));
            updateUrl();
          }}
          key={selection.value}
          value={selection.value}
        />
      ))}
    </>
  );
};

// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
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
const TargetGroupPills = memo(TargetGroupsBullets, updateSelections);
export default memo(SelectionsContainer, updateSelections);

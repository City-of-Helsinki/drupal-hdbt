import { useAtomValue, useSetAtom } from 'jotai';
import { formErrorsAtom, updateUrlAtom } from '../../../store';
import { SearchBar } from '../components/SearchBar';
import { StartDateFilter } from '../components/StartDateFilter';
import SubmitButton from '../../../components/SubmitButton';
import { useMemo, type FormEvent } from 'react';
import { InstructionLanguageFilter } from '../components/InstructionLanguageFilter';
import { TeachingModeFilter } from '../components/TeachingModeFilter';
import { SelectionsContainer } from './SelectionsContainer';
import { initializeStateAtom, visibleParams } from '../store';
import { DateTime } from 'luxon';

const dateBreakpoints = {
  autumn: {
    end: { month: 12, day: 31 },
    label: Drupal.t('Autumn', {}, { context: 'Cross-institutional studies: date filter option' }),
    start: { month: 8, day: 1 },
  },
  spring: {
    end: { month: 5, day: 31 },
    label: Drupal.t('Spring', {}, { context: 'Cross-institutional studies: date filter option' }),
    start: { month: 1, day: 1 },
  },
  summer: {
    end: { month: 7, day: 31 },
    label: Drupal.t('Summer', {}, { context: 'Cross-institutional studies: date filter option' }),
    start: { month: 6, day: 1 },
  },
}

const seasonOrder: (keyof typeof dateBreakpoints)[] = ['spring', 'summer', 'autumn'];

const generateDateOptions = (dateOverride?: DateTime) => {
  const today = dateOverride ?? DateTime.now();
  const options = new Map<string, { start: DateTime; end: DateTime }>();

  const semesters = [0, 1].flatMap((yearOffset) =>
    seasonOrder.map((season) => {
      const { start, end, label} = dateBreakpoints[season];
      return {
        end: DateTime.fromObject({ year: today.year + yearOffset, month: end.month, day: end.day }),
        label,
        season,
        start: DateTime.fromObject({ year: today.year + yearOffset, month: start.month, day: start.day }),
      };
    }),
  );

  let index = semesters.findIndex(({ end }) => today <= end);
  if (index === -1) {
    index = 0;
  }

  while (options.size < 3 && index < semesters.length) {
    const { end, label, start } = semesters[index];
    
    const seasonalLabel = `${label} ${start.year}`;

    options.set(seasonalLabel, { start, end });
    index++;
  }

  return options;
}

export const CrossStudiesFormContainer = ({
  initialize,
  initialized,
  dateOverride,
}: {
  initialize: () => void
  initialized: boolean
  dateOverride?: DateTime,
}) => {
  const errors = useAtomValue(formErrorsAtom);
  const updateUrl = useSetAtom(updateUrlAtom);
  const initializeAtom = useSetAtom(initializeStateAtom);
  const dateOptions = useMemo(() => generateDateOptions(dateOverride), [dateOverride]); 

  if (!initialized) {
    initializeAtom(dateOptions);
    initialize();
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUrl(visibleParams);
  };

  return (
    <form
      className='hdbt-search--react__form-container'
      onSubmit={handleSubmit}
      role='search' 
    >
      <div className='event-form__filters-container'>
        <SearchBar />
        <div className='event-form__filter-section-container'>
          <StartDateFilter dateOptions={dateOptions} />
          <TeachingModeFilter />
          <InstructionLanguageFilter />
        </div>
        <SubmitButton disabled={errors.invalidStartDate} />
        <SelectionsContainer />
      </div>
    </form>
  );
}

import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  languageAtom,
  resetFormAtom,
  submittedParamsAtom,
  updateDatesAtom,
  updateParamsAtom,
  updateUrlAtom,
} from '../../../store';
import { keywordAtom, startDateAtom, teachingModeAtom, visibleParams } from '../store';
import ApiKeys from '../../../enum/ApiKeys';
import FilterButton from '@/react/common/FilterButton';
import { memo } from 'react';
import type { Option } from 'hds-react';

type InnerProps = {
  submittedParams: URLSearchParams;
  startDate: Option[];
  setStartDate: (value: Option[]) => void;
  teachingMode: Option[];
  setTeachingMode: (value: Option[]) => void;
  instructionLanguage: Option[];
  setInstructionLanguage: (value: Option[]) => void;
};

const SelectionsContent = memo(
  ({
    submittedParams,
    startDate,
    setStartDate,
    teachingMode,
    setTeachingMode,
    instructionLanguage,
    setInstructionLanguage,
  }: InnerProps) => {
    const resetSubmittedSate = useSetAtom(resetFormAtom);
    const updateUrl = useSetAtom(updateUrlAtom);
    const updateParams = useSetAtom(updateParamsAtom);
    const updateDates = useSetAtom(updateDatesAtom);
    const setKeyword = useSetAtom(keywordAtom);

    const selections: JSX.Element[] = [];

    if (submittedParams.has(ApiKeys.END) && submittedParams.has(ApiKeys.START)) {
      selections.push(
        <FilterButton
          key='startDate'
          value={startDate[0]?.label || ''}
          clearSelection={() => {
            setStartDate([]);
            updateDates({
              end: undefined,
              start: undefined,
            });
            updateUrl(visibleParams);
          }}
        />,
      );
    }

    if (submittedParams.has(ApiKeys.LANGUAGE)) {
      const submittedLanguages = submittedParams.get(ApiKeys.LANGUAGE)?.split(',') ?? [];
      const selectedLanguages = instructionLanguage.filter((lang) => submittedLanguages.includes(lang.value));
      selections.push(
        ...selectedLanguages.map((lang) => (
          <FilterButton
            key={lang.value}
            value={lang.label}
            clearSelection={() => {
              const newLanguages = instructionLanguage.filter((l) => l.value !== lang.value);
              setInstructionLanguage(newLanguages);
              updateParams({
                [ApiKeys.LANGUAGE]: newLanguages.map((l) => l.value),
              });
              updateUrl(visibleParams);
            }}
          />
        )),
      );
    }

    if (submittedParams.has(ApiKeys.KEYWORDS)) {
      const submittedKeywords = submittedParams.get(ApiKeys.KEYWORDS)?.split(',') ?? [];
      const selectedModes = teachingMode.filter((mode) => submittedKeywords.includes(mode.value));
      selections.push(
        ...selectedModes.map((mode) => (
          <FilterButton
            key={mode.value}
            value={mode.label}
            clearSelection={() => {
              const newModes = teachingMode.filter((m) => m.value !== mode.value);
              setTeachingMode(newModes);
              updateParams({
                [ApiKeys.KEYWORDS]: newModes.map((m) => m.value),
              });
              updateUrl(visibleParams);
            }}
          />
        )),
      );
    }

    const resetForm = () => {
      setStartDate([]);
      setTeachingMode([]);
      setKeyword('');
      resetSubmittedSate();
      updateUrl(visibleParams);
    };

    return (
      <SelectionsWrapper
        showClearButton={selections.length || submittedParams.has(ApiKeys.COMBINED_TEXT)}
        resetForm={resetForm}
      >
        {selections}
      </SelectionsWrapper>
    );
  },
  (prev, next) => prev.submittedParams.toString() === next.submittedParams.toString(),
);

export const SelectionsContainer = () => {
  const submittedParams = useAtomValue(submittedParamsAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [teachingMode, setTeachingMode] = useAtom(teachingModeAtom);
  const [instructionLanguage, setInstructionLanguage] = useAtom(languageAtom);

  return (
    <SelectionsContent
      submittedParams={submittedParams}
      startDate={startDate}
      setStartDate={setStartDate}
      teachingMode={teachingMode}
      setTeachingMode={setTeachingMode}
      instructionLanguage={instructionLanguage as Option[]}
      setInstructionLanguage={setInstructionLanguage}
    />
  );
};

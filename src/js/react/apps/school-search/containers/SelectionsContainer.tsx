import { useAtomValue, useSetAtom } from 'jotai';
import FilterButton from '@/react/common/FilterButton';
import transformDropdownsValues from '@/react/common/helpers/Params';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import type OptionType from '@/types/OptionType';
import SearchComponents from '../enum/SearchComponents';
import {
  a1Atom,
  a1SelectionAtom,
  a2Atom,
  a2SelectionAtom,
  b1Atom,
  b1SelectionAtom,
  b2Atom,
  b2SelectionAtom,
  bilingualEducationAtom,
  bilingualEducationSelectionAtom,
  paramsAtom,
  updateParamsAtom,
  weightedEducationAtom,
  weightedEducationSelectionAtom,
} from '../store';
import type SearchParams from '../types/SearchParams';

type SelectionsContainerProps = {
  keys: Array<
    keyof Omit<
      SearchParams,
      'keyword' | 'page' | 'query' | 'a1' | 'a2' | 'b1' | 'b2' | 'weighted_education' | 'bilingual_education'
    >
  >;
};

const SelectionsContainer = ({ keys }: SelectionsContainerProps) => {
  const searchParams = useAtomValue(paramsAtom);
  const setSearchParams = useSetAtom(updateParamsAtom);
  const a1Options = useAtomValue(a1Atom);
  const updateA1 = useSetAtom(a1SelectionAtom);
  const a2Options = useAtomValue(a2Atom);
  const updateA2 = useSetAtom(a2SelectionAtom);
  const b1Options = useAtomValue(b1Atom);
  const updateB1 = useSetAtom(b1SelectionAtom);
  const b2Options = useAtomValue(b2Atom);
  const updateB2 = useSetAtom(b2SelectionAtom);
  const weightedOptions = useAtomValue(weightedEducationAtom);
  const updateWeighted = useSetAtom(weightedEducationSelectionAtom);
  const bilingualOptions = useAtomValue(bilingualEducationAtom);
  const updateBilingual = useSetAtom(bilingualEducationSelectionAtom);

  const checkBoxFilters = {
    grades_1_6: Drupal.t('School providing grades 1 to 6', {}, { context: 'School search: education level option' }),
    grades_1_9: Drupal.t('School providing grades 1 to 9', {}, { context: 'School search: education level option' }),
    grades_7_9: Drupal.t('School providing grades 7 to 9', {}, { context: 'School search: education level option' }),
    finnish_education: Drupal.t('Finnish', {}, { context: 'School search: language option' }),
    swedish_education: Drupal.t('Swedish', {}, { context: 'School search: language option' }),
  };
  const checkBoxKeys = Object.keys(checkBoxFilters);

  const getPills = () => {
    const pills: JSX.Element[] = [];

    keys.forEach((key) => {
      if (!checkBoxKeys.includes(key) || !searchParams[key]) {
        return;
      }

      pills.push(
        <FilterButton
          key={key}
          value={
            key === 'finnish_education' || key === 'swedish_education'
              ? `${Drupal.t('Language of instruction', {}, { context: 'School search: language options' })}: ${checkBoxFilters[key]}`
              : checkBoxFilters[key]
          }
          clearSelection={() => {
            const newParams = { ...searchParams };
            newParams[key] = false;
            setSearchParams(newParams);
          }}
        />,
      );
    });

    return pills;
  };

  const resetForm = () => {
    setSearchParams({});

    // Reset individual selection atoms to their default states
    updateA1([]);
    updateA2([]);
    updateB1([]);
    updateB2([]);
    updateWeighted([]);
    updateBilingual([]);
  };

  const showClearButton =
    searchParams.finnish_education ||
    searchParams.swedish_education ||
    searchParams.grades_1_6 ||
    searchParams.grades_1_9 ||
    searchParams.grades_7_9 ||
    searchParams.a1?.length ||
    searchParams.a2?.length ||
    searchParams.b1?.length ||
    searchParams.b2?.length ||
    searchParams.weighted_education?.length ||
    searchParams.bilingual_education?.length;

  const showA1 = Boolean(searchParams.a1?.length && searchParams.a1?.length > 0);
  const showA2 = Boolean(searchParams.a2?.length && searchParams.a2?.length > 0);
  const showB1 = Boolean(searchParams.b1?.length && searchParams.b1?.length > 0);
  const showB2 = Boolean(searchParams.b2?.length && searchParams.b2?.length > 0);
  const showWeighted = Boolean(searchParams.weighted_education?.length && searchParams.weighted_education?.length > 0);
  const showBilingual = Boolean(
    searchParams.bilingual_education?.length && searchParams.bilingual_education?.length > 0,
  );

  return (
    <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
      {getPills()}
      {showA1 && (
        <ListFilter
          updater={updateA1}
          valueKey={SearchComponents.A1}
          values={transformDropdownsValues(searchParams.a1, a1Options)}
          labelPrefix={Drupal.t('A1-language', {}, { context: 'TPR Ontologyword details schools' })}
        />
      )}
      {showA2 && (
        <ListFilter
          updater={updateA2}
          valueKey={SearchComponents.A2}
          values={transformDropdownsValues(searchParams.a2, a2Options)}
          labelPrefix={Drupal.t('A2-language', {}, { context: 'TPR Ontologyword details schools' })}
        />
      )}
      {showB1 && (
        <ListFilter
          updater={updateB1}
          valueKey={SearchComponents.B1}
          values={transformDropdownsValues(searchParams.b1, b1Options)}
          labelPrefix={Drupal.t('B1-language', {}, { context: 'TPR Ontologyword details schools' })}
        />
      )}
      {showB2 && (
        <ListFilter
          updater={updateB2}
          valueKey={SearchComponents.B2}
          values={transformDropdownsValues(searchParams.b2, b2Options)}
          labelPrefix={Drupal.t('B2-language', {}, { context: 'TPR Ontologyword details schools' })}
        />
      )}
      {showWeighted && (
        <ListFilter
          updater={updateWeighted}
          valueKey={SearchComponents.WeightedEducation}
          values={transformDropdownsValues(searchParams.weighted_education, weightedOptions)}
          labelPrefix={Drupal.t('Weighted curriculum education', {}, { context: 'TPR Ontologyword details schools' })}
        />
      )}
      {showBilingual && (
        <ListFilter
          updater={updateBilingual}
          valueKey={SearchComponents.BilingualEducation}
          values={transformDropdownsValues(searchParams.bilingual_education, bilingualOptions)}
        />
      )}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;

type ListFilterProps = {
  // biome-ignore lint/complexity/noBannedTypes: @todo UHF-12066
  updater: Function;
  valueKey: string;
  values: OptionType[];
  labelPrefix?: string;
};

const ListFilter = ({ updater, values, valueKey, labelPrefix }: ListFilterProps) => {
  const searchParams = useAtomValue(paramsAtom);
  const setSearchParams = useSetAtom(updateParamsAtom);

  const removeSelection = (value: string) => {
    const newValue = values;
    const index = newValue.findIndex((selection: OptionType) => selection.value === value);
    newValue.splice(index, 1);
    updater(newValue);
    setSearchParams({
      ...searchParams,
      [valueKey]: newValue.map((selection: OptionType) => selection.value),
    });
  };

  return (
    <>
      {values.map((selection: OptionType) => (
        <FilterButton
          value={labelPrefix ? `${labelPrefix}: ${selection.label}` : selection.label}
          clearSelection={() => removeSelection(selection.value)}
          key={selection.value}
        />
      ))}
    </>
  );
};

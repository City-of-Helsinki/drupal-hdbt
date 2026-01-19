import { useAtomValue, useSetAtom } from 'jotai';
import { searchStateAtom, submitStateAtom, submittedStateAtom } from '../store';
import type URLParams from '../types/URLParams';
import FilterButton from '@/react/common/FilterButton';
import type { OptionType } from '../types/OptionType';
import SearchComponents from '../enum/SearchComponents';
import { getCheckBoxFilterLabel, stripQuantityFromLabel } from '../helpers/Options';

type arraySelectionKey = keyof Pick<URLParams, 'task_areas' | 'employment' | 'area_filter'>;
type stringSelectionKey = keyof Pick<URLParams, 'language' | 'keyword'>;
type booleanSelectionKey = keyof Pick<URLParams, 'continuous' | 'internship' | 'summer_jobs' | 'youth_summer_jobs'>;

export const useSelectionButtons = (selections: [string, OptionType[] | boolean | string][]) => {
  const submittedState = useAtomValue(submittedStateAtom);
  const setState = useSetAtom(searchStateAtom);
  const submitState = useSetAtom(submitStateAtom);
  const selectionButtons: JSX.Element[] = [];

  const removeArrayItem = (key: arraySelectionKey, value: string) => {
    const state = { ...submittedState };
    const existing = [...((state[key] as OptionType[]) || [])];
    existing.splice(
      existing.findIndex((item) => item.value === value),
      1,
    );
    state[key] = existing;
    setState(state);
    submitState();
  };

  const unsetStateItem = (key: stringSelectionKey) => {
    const state = { ...submittedState };
    delete state[key];
    setState(state);
    submitState();
  };

  const setStateItemFalse = (key: booleanSelectionKey) => {
    const state = { ...submittedState };
    state[key] = false;
    setState(state);
    submitState();
  };

  selections.forEach(([key, value]) => {
    if (Array.isArray(value) && value.length) {
      value.forEach((option) => {
        selectionButtons.push(
          <FilterButton
            key={`${key}-${option.value}`}
            clearSelection={() => removeArrayItem(key as arraySelectionKey, option.value)}
            value={
              [SearchComponents.EMPLOYMENT, SearchComponents.LANGUAGE, SearchComponents.TASK_AREAS].includes(key)
                ? stripQuantityFromLabel(option.label)
                : option.label
            }
          />,
        );
      });
    } else if (typeof value === 'string') {
      selectionButtons.push(
        <FilterButton
          key={`${key}-${value}`}
          clearSelection={() => unsetStateItem(key as stringSelectionKey)}
          value={value}
        />,
      );
    } else if (typeof value === 'boolean' && value === true) {
      selectionButtons.push(
        <FilterButton
          key={`${key}-true`}
          clearSelection={() => setStateItemFalse(key as booleanSelectionKey)}
          value={getCheckBoxFilterLabel(key)}
        />,
      );
    }
  });

  return selectionButtons;
};

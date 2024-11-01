import { atom } from 'jotai';

import { type FormConfigItem } from './types/FormConfig';
import { StepState } from 'hds-react';
import { type ZodError } from 'zod';

type Result = {
  success: boolean;
  error?: ZodError<any>;
}

type StateItem = FormConfigItem & {
  data: FormData;
  error?: ZodError<any>;
};

type FormState = {
  items: StateItem[];
  currentStep: number;
  visitedSteps: Set<number>;
}

const formStateAtom = atom<FormState>({
  items: [],
  currentStep: 0,
  visitedSteps: new Set([0]),
})
export const initializeFormStateAtom = atom(null, (_get, set, formConfig: FormConfigItem[], currentStep: number = 0, visitedSteps: Set<number> = new Set([0])) => {
  set (formStateAtom, (state) => {
    return {
      items: formConfig.map((item) => ({
        ...item,
        data: new FormData(),
      })),
      currentStep,
      visitedSteps,
    };
  });
})
export const getItemsAtom = atom(get => get(formStateAtom).items);
export const modifyFormStateAtom = atom(null, (_get, set, formData: FormData, result: Result, step: number) => {
  set (formStateAtom, (state) => {
    const items = [...state.items];

    if (!items[step]) {
      throw new Error('Trying to set data for non-existing step');
    }

    items[step].data = formData;
    if (!result.success) {
      items[step].error = result.error;
    }
    else {
      items[step].error = undefined;
    }

    return {
      ...state,
      items
    };
  });
});
export const getStepsAtom = atom(get => {
  const state = get(formStateAtom);
  return state.items.map((item: StateItem) => ({
    label: item.label,
    state: item.error ? StepState.attention : StepState.available
  }))
});
export const getCurrentStepAtom = atom(get => get(formStateAtom).currentStep);
export const setPageAtom = atom(null, (_get, set, step: number) => {
  set (formStateAtom, (state) => {
    if (!state.items[step]) {
      throw new Error(`Unknown index ${step} for a step`);
    }
    if (!state.visitedSteps.has(step)) {
      state.visitedSteps.add(step);
    }
    state.currentStep = step;

    return {...state};
  });
});

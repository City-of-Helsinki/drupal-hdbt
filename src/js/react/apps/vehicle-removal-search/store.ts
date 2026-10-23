import type { Option } from 'hds-react';
import { atom } from 'jotai';
import { stateToURLParams } from '@/react/common/helpers/StateToURLParams';

export interface SearchState {
  streets: Option[];
  postalCodes: Option[];
  page: number;
}

const defaultState: SearchState = {
  streets: [],
  postalCodes: [],
  page: 1,
};

const paramToOptions = (values: string[]): Option[] =>
  values.map((value) => ({
    value,
    label: value,
    selected: true,
    isGroupLabel: false,
    visible: true,
    disabled: false,
  }));

const urlParamsToState = (): SearchState => {
  const params = new URLSearchParams(window.location.search);

  return {
    ...defaultState,
    streets: paramToOptions(params.getAll('streets')),
    postalCodes: paramToOptions(params.getAll('postalCodes')),
    page: Number(params.get('page')) || 1,
  };
};

const initialState = urlParamsToState();

export const streetsAtom = atom(
  (get) => get(submittedStateAtom)?.streets || [],
  (get, set, value: Option[]) => {
    const state = { ...get(submittedStateAtom) } as SearchState;
    state.streets = value;
    state.page = 1;
    set(submittedStateAtom, state, true);
  },
);

export const postalCodesAtom = atom(
  (get) => get(submittedStateAtom)?.postalCodes || [],
  (get, set, value: Option[]) => {
    const state = { ...get(submittedStateAtom) } as SearchState;
    state.postalCodes = value;
    state.page = 1;
    set(submittedStateAtom, state, true);
  },
);

export const submittedStateAtom = atom<SearchState, [Partial<SearchState>, boolean?], void>(
  initialState,
  (get, set, newValue: Partial<SearchState>, triggerFocus: boolean = false) => {
    const update = {
      ...get(submittedStateAtom),
      ...newValue,
    };

    set(submittedStateAtom, update);
    set(triggerFocusAtom, triggerFocus);

    const params = stateToURLParams(update);
    const url = new URL(window.location.href);

    if (url.searchParams.toString() !== params.toString()) {
      url.search = params.toString();
      window.history.pushState({}, '', url);
    }
  },
);

export const triggerFocusAtom = atom<boolean>(true);

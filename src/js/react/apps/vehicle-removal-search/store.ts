import type { Option } from 'hds-react';
import { atom } from 'jotai';
import { stateToURLParams } from '@/react/common/helpers/StateToURLParams';

export interface SearchState {
  streets: Option[];
  page: number;
}

const defaultState: SearchState = {
  streets: [],
  page: 1,
};

const urlParamsToState = (): SearchState => {
  const params = new URLSearchParams(window.location.search);
  const streetsParam = params.getAll('streets');
  const page = Number(params.get('page')) || 1;

  if (!streetsParam) {
    return defaultState;
  }

  const streets: Option[] = streetsParam.map((name) => ({
    value: name,
    label: name,
    selected: true,
    isGroupLabel: false,
    visible: true,
    disabled: false,
  }));

  return { streets, page };
};

const initialState = urlParamsToState();

export const streetsAtom = atom(
  (get) => get(submittedStateAtom)?.streets || [],
  (get, set, value: Option[]) => {
    const state = { ...get(submittedStateAtom) } as SearchState;
    state.streets = value;
    set(submittedStateAtom, state);
  },
);

export const submittedStateAtom = atom<SearchState, [Partial<SearchState>], void>(
  initialState,
  (get, set, newValue: Partial<SearchState>) => {
    const update = {
      ...get(submittedStateAtom),
      ...newValue,
    };

    set(submittedStateAtom, update);

    const params = stateToURLParams(update);
    const url = new URL(window.location.href);

    if (url.searchParams.toString() !== params.toString()) {
      url.search = params.toString();
      window.history.pushState({}, '', url);
    }
  },
);

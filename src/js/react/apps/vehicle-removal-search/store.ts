import { atom } from 'jotai';
import type { Option } from 'hds-react';
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
  const page = +params.get('page') || 1;

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

// Live form state — updates immediately when user interacts with filters.
export const searchStateAtom = atom<SearchState>(initialState);

export const streetsAtom = atom(
  (get) => get(searchStateAtom)?.streets || [],
  (get, set, value: Option[]) => {
    const state = { ...get(searchStateAtom) } as SearchState;
    state.streets = value;
    set(searchStateAtom, state);
  },
);

// Submitted state — only updates on form submit or selection clearing.
// The query hook reads from this so results don't change until submission.
export const submittedStateAtom = atom<SearchState, [Partial<SearchState>], void>(
  initialState,
  (get, set, newValue: Partial<SearchState>) => {
    const update = {
      ...get(submittedStateAtom),
      ...newValue,
    };

    set(submittedStateAtom, update);
    set(searchStateAtom, update);

    const params = stateToURLParams(update);
    const url = new URL(window.location.href);

    if (url.searchParams.toString() !== params.toString()) {
      url.search = params.toString();
      window.history.pushState({}, '', url);
    }
  },
);

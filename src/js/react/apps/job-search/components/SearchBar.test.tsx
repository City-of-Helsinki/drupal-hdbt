import { fireEvent, render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { useRef, useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SelectionsContainer from '../containers/SelectionsContainer';
import SearchComponents from '../enum/SearchComponents';
import { getKeywordAtom, searchStateAtom, submittedStateAtom } from '../store';
import { SearchBar } from './SearchBar';

type Selections = 'none' | 'keyword';

const createTestStore = (keyword: string) => {
  const store = createStore();
  const state = { ...store.get(searchStateAtom), [SearchComponents.KEYWORD]: keyword };

  store.set(searchStateAtom, state);
  store.set(submittedStateAtom, state);

  return store;
};

function Harness({ selections = 'none' }: { selections?: Selections }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [renders, setRenders] = useState(0);

  return (
    <form ref={formRef}>
      <SearchBar formRef={formRef} />
      {selections === 'keyword' && <SelectionsContainer />}
      <button type='button' onClick={() => setRenders(renders + 1)}>
        Re-render
      </button>
    </form>
  );
}

const renderSearchBar = (keyword: string, selections?: Selections) => {
  const store = createTestStore(keyword);
  const { container, getByLabelText, getByText } = render(
    <Provider store={store}>
      <Harness selections={selections} />
    </Provider>,
  );

  return {
    store,
    getByLabelText,
    getByText,
    input: container.querySelector('input') as HTMLInputElement,
  };
};

beforeEach(() => {
  // Typing in the field asks Elasticsearch for suggestions.
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ hits: { hits: [] } }) }));
});

describe('SearchBar', () => {
  test('shows a keyword that was loaded from the URL', () => {
    const { input, store } = renderSearchBar('psychologist');

    expect(input.value).toBe('psychologist');
    expect(store.get(getKeywordAtom)).toBe('psychologist');
  });

  test('keeps a keyword that was loaded from the URL over a re-render', () => {
    const { input, store, getByText } = renderSearchBar('psychologist');

    // HDS pushes its own, still empty, copy of the term back out on every render
    // where the two disagree. Nothing that re-renders the form may clear the
    // keyword the visitor arrived with.
    fireEvent.click(getByText('Re-render'));

    expect(input.value).toBe('psychologist');
    expect(store.get(getKeywordAtom)).toBe('psychologist');
  });

  test('normalizes the whitespace of a keyword that was loaded from the URL', () => {
    const { store } = renderSearchBar('sports    services');

    expect(store.get(getKeywordAtom)).toBe('sports services');
  });

  test('writes what is typed into the field to the search state', () => {
    const { input, store } = renderSearchBar('');

    fireEvent.change(input, { target: { value: 'nurse' } });

    expect(store.get(getKeywordAtom)).toBe('nurse');
  });

  test('clears the keyword when the field is emptied by typing', () => {
    const { input, store } = renderSearchBar('psychologist');

    fireEvent.change(input, { target: { value: '' } });

    expect(store.get(getKeywordAtom)).toBe('');
    expect(input.value).toBe('');
  });

  test('keeps focus in the field when it is emptied by typing', () => {
    const { input } = renderSearchBar('psychologist');

    input.focus();
    fireEvent.change(input, { target: { value: '' } });

    // Emptying the field must not remount the HDS Search component: that
    // replaces the input element and drops the caret out of the field.
    expect(document.activeElement).toBe(input);
    expect(input.isConnected).toBe(true);
  });

  test('clears the keyword when the HDS clear button is used', () => {
    const { input, store, getByLabelText } = renderSearchBar('psychologist');

    input.focus();
    fireEvent.click(getByLabelText('Clear'));

    expect(store.get(getKeywordAtom)).toBe('');
    expect(document.activeElement).toBe(input);
  });

  test('empties the field when the keyword selection is removed', () => {
    const { store, getByLabelText } = renderSearchBar('psychologist', 'keyword');

    fireEvent.click(getByLabelText('Remove Search term: psychologist from search results'));

    expect(store.get(getKeywordAtom)).toBe('');
    // The field is remounted to reset the copy of the term HDS keeps internally,
    // so the element has to be looked up again.
    expect(document.querySelector('input')?.value).toBe('');
  });

  test('accepts a new keyword after the keyword selection was removed', () => {
    const { store, getByLabelText } = renderSearchBar('psychologist', 'keyword');

    fireEvent.click(getByLabelText('Remove Search term: psychologist from search results'));

    // The input is remounted when the selection is removed, so the fresh input
    // element has to be looked up again.
    const input = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'nurse' } });

    expect(store.get(getKeywordAtom)).toBe('nurse');
  });

  test('keeps the same input element while the keyword is edited', () => {
    const { input, store } = renderSearchBar('psychologist');

    fireEvent.change(input, { target: { value: 'psychologists' } });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: 'nurse' } });

    expect(document.querySelector('input')).toBe(input);
    expect(store.get(getKeywordAtom)).toBe('nurse');
  });
});

import { createStore } from 'jotai';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SearchComponents from './enum/SearchComponents';
import {
  deferFocusAtom,
  searchStateAtom,
  setFilterValueAtom,
  setPageAtom,
  setStateValueAtom,
  submitStateAtom,
  submittedStateAtom,
} from './store';

const taskArea = [{ label: 'Health care (5)', simpleLabel: 'Health care', value: '01' }];

describe('submitStateAtom', () => {
  let pushState: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
  });

  test('passes new reference on resubmit so useSearchFocusManagement detects it', () => {
    const store = createStore();
    store.set(setStateValueAtom, { key: SearchComponents.KEYWORD, value: 'nurse' });
    store.set(submitStateAtom);
    const first = store.get(submittedStateAtom);

    store.set(submitStateAtom);
    const second = store.get(submittedStateAtom);

    expect(second).toEqual(first);
    expect(second).not.toBe(first);
  });

  test('does not push a duplicate history entry for an unchanged resubmit', () => {
    const store = createStore();
    store.set(setStateValueAtom, { key: SearchComponents.KEYWORD, value: 'nurse' });
    store.set(submitStateAtom);
    expect(pushState).toHaveBeenCalledTimes(1);

    store.set(submitStateAtom);
    expect(pushState).toHaveBeenCalledTimes(1);

    store.set(setStateValueAtom, { key: SearchComponents.KEYWORD, value: 'doctor' });
    store.set(submitStateAtom);
    expect(pushState).toHaveBeenCalledTimes(2);
  });

  test('keeps the submitted keyword when only the page changes', () => {
    const store = createStore();
    store.set(setStateValueAtom, { key: SearchComponents.KEYWORD, value: 'nurse' });
    store.set(submitStateAtom);

    store.set(setPageAtom, '3');

    const submitted = store.get(submittedStateAtom);
    expect(submitted[SearchComponents.PAGE]).toBe('3');
    expect(submitted[SearchComponents.KEYWORD]).toBe('nurse');
    expect(store.get(searchStateAtom)[SearchComponents.PAGE]).toBe('3');
  });

  test('moves focus to the results when the form is submitted by hand', () => {
    const store = createStore();
    store.set(submitStateAtom);

    expect(store.get(deferFocusAtom)).toBe(false);
  });
});

describe('setFilterValueAtom', () => {
  const settings = { path: { currentLanguage: 'en' }, helfi_react_search: { elastic_proxy_url: '' } };

  beforeEach(() => {
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.stubGlobal('drupalSettings', settings);
  });

  test('searches right away when a filter changes', () => {
    const store = createStore();
    store.set(setFilterValueAtom, { key: SearchComponents.TASK_AREAS, value: taskArea });

    expect(store.get(submittedStateAtom)[SearchComponents.TASK_AREAS]).toEqual(taskArea);
    expect(store.get(deferFocusAtom)).toBe(true);
  });

  test('returns to the first page when a filter changes', () => {
    const store = createStore();
    store.set(setPageAtom, '3');
    store.set(setFilterValueAtom, { key: SearchComponents.TASK_AREAS, value: taskArea });

    expect(store.get(submittedStateAtom)[SearchComponents.PAGE]).toBe('1');
  });
});

import { createStore } from 'jotai';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SearchComponents from './enum/SearchComponents';
import { searchStateAtom, setPageAtom, setStateValueAtom, submitStateAtom, submittedStateAtom } from './store';

describe('submitStateAtom', () => {
  let pushState: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
  });

  test('stores a new snapshot on every submit so a resubmit is observable', () => {
    const store = createStore();
    store.set(setStateValueAtom, { key: SearchComponents.KEYWORD, value: 'nurse' });
    store.set(submitStateAtom);
    const first = store.get(submittedStateAtom);

    // Submit again without touching the form.
    store.set(submitStateAtom);
    const second = store.get(submittedStateAtom);

    // Same values — a plain equality check would see no change...
    expect(second).toEqual(first);
    // ...but the snapshot is a new object, which is what useSearchFocusManagement
    // compares to detect the resubmit.
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
});

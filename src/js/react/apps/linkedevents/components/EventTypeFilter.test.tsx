import { fireEvent, render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
import type { EventsAppConfig } from '../helpers/ReadEventListConfig';
import { configAtom, eventTypeAtom } from '../store';
import { EventTypeFilter } from './EventTypeFilter';

const storeFor = (instanceId: string) => {
  const store = createStore();
  store.set(configAtom, { instanceId } as EventsAppConfig);

  return store;
};

const setup = () => {
  const first = storeFor('1375');
  const second = storeFor('1402');
  const utils = render(
    <>
      <Provider store={first}>
        <EventTypeFilter />
      </Provider>
      <Provider store={second}>
        <EventTypeFilter />
      </Provider>
    </>,
  );

  return { ...utils, first, second };
};

describe('EventTypeFilter', () => {
  it('maps each checkbox to its own event type', () => {
    const { container, first } = setup();

    fireEvent.click(container.querySelector('#hobby-type-toggle--1375') as Element);
    expect(first.get(eventTypeAtom)).toEqual(['Course']);

    fireEvent.click(container.querySelector('#event-type-toggle--1375') as Element);
    expect(first.get(eventTypeAtom)).toEqual(['Course', 'General']);
  });

  it('does not let one embed`s selection reach the other', () => {
    const { container, first, second } = setup();

    fireEvent.click(container.querySelector('#event-type-toggle--1375') as Element);

    expect(first.get(eventTypeAtom)).toEqual(['General']);
    expect(second.get(eventTypeAtom)).toEqual([]);
  });
});

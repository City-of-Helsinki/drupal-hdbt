import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readEventListConfig } from './helpers/ReadEventListConfig';
import {
  addressAtom,
  clearSignalAtom,
  createEventsStore,
  paramsAtom,
  resetFormAtom,
  settingsAtom,
  submittedParamsAtom,
  topicSelectionAtom,
  updateUrlAtom,
} from './store';

const API = 'https://api.hel.fi/linkedevents/v1/event/';

const settingsFor = (count: string, eventType: string) => ({
  event_list_layout: 'default' as const,
  event_list_type: 'events' as const,
  events_api_url: `${API}?event_type=${eventType}&page=1`,
  events_public_url: 'https://tapahtumat.hel.fi',
  field_event_count: count,
  field_event_list_title: `List ${count}`,
  field_event_location: false,
  field_event_time: false,
  field_filter_keywords: [],
  field_free_events: false,
  field_language: false,
  field_remote_events: false,
  field_search_term: false,
  hideHeading: false,
  hidePagination: false,
  hobbies_public_url: 'https://harrastukset.hel.fi',
  places: {},
  removeBloatingEvents: false,
  use_fixtures: false as const,
  useCrossInstitutionalStudiesForm: false,
  useFullLocationFilter: false,
  useFullTopicsFilter: false,
  useLocationSearch: false,
  useTargetGroupFilter: false,
});

const rootFor = (paragraphId: string) => {
  const element = document.createElement('div');
  element.dataset.paragraphId = paragraphId;
  return element;
};

const storeFor = (paragraphId: string, index: number, search = '') => {
  const config = readEventListConfig(rootFor(paragraphId), { index, search });
  if (!config) {
    throw new Error(`no config for ${paragraphId}`);
  }
  return createEventsStore(config);
};

beforeEach(() => {
  drupalSettings.helfi_events.data = {
    '1375': settingsFor('3', 'General'),
    '1402': settingsFor('5', 'Course'),
  };
});

afterEach(() => vi.restoreAllMocks());

describe('event list store', () => {
  it('gives each embed its own settings', () => {
    const a = storeFor('1375', 0);
    const b = storeFor('1402', 1);

    expect(a.get(settingsAtom).eventCount).toBe(3);
    expect(b.get(settingsAtom).eventCount).toBe(5);
  });

  it('keeps one embed`s params out of the other', () => {
    const a = storeFor('1375', 0);
    const b = storeFor('1402', 1);

    a.set(paramsAtom, new URLSearchParams({ full_text: 'museo' }));

    expect(a.get(paramsAtom).get('full_text')).toBe('museo');
    expect(b.get(paramsAtom).get('full_text')).toBeNull();
    expect(b.get(paramsAtom).get('event_type')).toBe('Course');
  });

  it('seeds submitted params from the embed`s own api url', () => {
    const a = storeFor('1375', 0);
    const b = storeFor('1402', 1);

    expect(a.get(submittedParamsAtom).get('event_type')).toBe('General');
    expect(b.get(submittedParamsAtom).get('event_type')).toBe('Course');
  });

  it('resets only the embed the form belongs to', () => {
    const a = storeFor('1375', 0);
    const b = storeFor('1402', 1);
    const topic = [{ value: 'yso:p1235', label: 'Elokuvat' }];

    a.set(topicSelectionAtom, topic);
    b.set(topicSelectionAtom, topic);
    a.set(resetFormAtom);

    expect(a.get(topicSelectionAtom)).toEqual([]);
    expect(b.get(topicSelectionAtom)).toEqual(topic);
    expect(a.get(clearSignalAtom)).toBe(1);
    expect(b.get(clearSignalAtom)).toBe(0);
  });

  describe('home address', () => {
    it('is read from the query string by the embed that owns it', () => {
      expect(storeFor('1375', 0, '?home_address=Kotikatu 1').get(addressAtom)).toBe('Kotikatu 1');
    });

    it('is left to that embed alone, so the others do not geocode the same address', () => {
      expect(storeFor('1402', 1, '?home_address=Kotikatu 1').get(addressAtom)).toBeNull();
    });
  });

  describe('url writing', () => {
    beforeEach(() => {
      window.history.pushState({}, '', '/');
    });

    it('is written by the embed that owns the query string', async () => {
      const store = storeFor('1375', 0);
      store.set(paramsAtom, new URLSearchParams({ full_text: 'museo' }));

      await store.set(updateUrlAtom, ['full_text']);

      expect(new URLSearchParams(window.location.search).get('full_text')).toBe('museo');
    });

    it('is left untouched by an embed that does not own it', async () => {
      const b = storeFor('1402', 1);
      b.set(paramsAtom, new URLSearchParams({ full_text: 'museo' }));

      await b.set(updateUrlAtom, ['full_text']);

      expect(window.location.search).toBe('');
    });

    it('does not touch the url when no visible params are given', async () => {
      const store = storeFor('1375', 0);
      store.set(paramsAtom, new URLSearchParams({ full_text: 'museo' }));

      await store.set(updateUrlAtom);

      expect(window.location.search).toBe('');
    });
  });

  describe('missing configuration', () => {
    it('skips an embed whose settings are absent instead of breaking the page', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(readEventListConfig(rootFor('9999'), { index: 0, search: '' })).toBeNull();
      expect(warn).toHaveBeenCalled();
    });

    it('skips an element with no paragraph id', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const element = document.createElement('div');

      expect(readEventListConfig(element, { index: 0, search: '' })).toBeNull();
      expect(warn).toHaveBeenCalled();
    });
  });
});

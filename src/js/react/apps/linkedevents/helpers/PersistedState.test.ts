import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSnapshot, PERSISTED_STATE_KEY, readSnapshot, type Snapshot, writeSnapshot } from './PersistedState';

const snapshot = (overrides: Partial<Snapshot> = {}): Snapshot => ({
  address: null,
  endDisabled: false,
  eventTypes: [],
  free: false,
  keyword: '',
  languages: [],
  locations: [],
  page: 1,
  params: new URLSearchParams('event_type=General&keyword_OR=yso%3Ap1235'),
  remote: false,
  submitted: new URLSearchParams('event_type=General&keyword_OR=yso%3Ap1235'),
  targetGroups: [],
  topics: [{ value: 'yso:p1235', label: 'Elokuvat' }],
  ...overrides,
});

const stored = () => JSON.parse(window.sessionStorage.getItem(PERSISTED_STATE_KEY) ?? '{}');

beforeEach(() => window.sessionStorage.clear());

afterEach(() => vi.restoreAllMocks());

describe('persisted state', () => {
  it('reads back what was written', () => {
    const written = snapshot({ end: new Date('2026-10-31T00:00:00.000Z'), free: true });

    writeSnapshot('/fi/page#1375', written);
    const read = readSnapshot('/fi/page#1375');

    expect({ ...read, params: read?.params.toString(), submitted: read?.submitted.toString() }).toEqual({
      ...written,
      params: written.params.toString(),
      start: undefined,
      submitted: written.submitted.toString(),
    });
  });

  it('keeps each form apart', () => {
    writeSnapshot('/fi/page#1375', snapshot());

    expect(readSnapshot('/fi/page#1402')).toBeNull();
  });

  it('removes a cleared entry, and the item once it is empty', () => {
    writeSnapshot('/fi/page#1375', snapshot());
    writeSnapshot('/fi/page#1402', snapshot());

    clearSnapshot('/fi/page#1375');
    expect(Object.keys(stored())).toEqual(['/fi/page#1402']);

    clearSnapshot('/fi/page#1402');
    expect(window.sessionStorage.getItem(PERSISTED_STATE_KEY)).toBeNull();
  });

  it('ignores unparseable or unknown data', () => {
    window.sessionStorage.setItem(PERSISTED_STATE_KEY, '{not json');
    expect(readSnapshot('/fi/page#1375')).toBeNull();

    window.sessionStorage.setItem(PERSISTED_STATE_KEY, JSON.stringify({ '/fi/page#1375': { submitted: 42 } }));
    expect(readSnapshot('/fi/page#1375')).toBeNull();
  });

  it('falls back to empty selections when a value is not a list', () => {
    window.sessionStorage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({
        '/fi/page#1375': {
          submitted: 'a=b',
          topics: 'broken',
        },
      }),
    );

    expect(readSnapshot('/fi/page#1375')).toMatchObject({
      topics: [],
      eventTypes: [],
      locations: [],
    });
  });

  it('keeps only the most recent entries', () => {
    const now = vi.spyOn(Date, 'now');

    for (let i = 0; i < 25; i++) {
      now.mockReturnValue(i);
      writeSnapshot(`/fi/page-${i}#1`, snapshot());
    }

    const keys = Object.keys(stored());
    expect(keys).toHaveLength(10);
    expect(keys).not.toContain('/fi/page-0#1');
    expect(keys).toContain('/fi/page-24#1');
  });

  it('survives storage that is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => writeSnapshot('/fi/page#1375', snapshot())).not.toThrow();
    expect(readSnapshot('/fi/page#1375')).toBeNull();
  });
});

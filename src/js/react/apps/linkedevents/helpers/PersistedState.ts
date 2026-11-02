import type { EventTypeOption } from '../types/EventTypeOption';
import type OptionType from '../types/OptionType';

export const PERSISTED_STATE_KEY = 'helfi-events-search';

export type Snapshot = {
  address?: string | null;
  end?: Date;
  endDisabled: boolean;
  eventTypes: EventTypeOption[];
  free: boolean;
  keyword: string;
  languages: OptionType[];
  locations: OptionType[];
  page: number;
  params: URLSearchParams;
  remote: boolean;
  start?: Date;
  submitted: URLSearchParams;
  targetGroups: OptionType[];
  topics: OptionType[];
};

// Dates and params are stored as strings, and the page is read from the submitted params.
type StoredSnapshot = Omit<Snapshot, 'end' | 'page' | 'params' | 'start' | 'submitted'> & {
  end?: string;
  params?: string;
  start?: string;
  submitted: string;
  t: number;
};

type Entries = Record<string, StoredSnapshot>;

const parseDate = (value?: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parsePage = (params: URLSearchParams) => {
  const page = Number(params.get('page'));

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const readEntries = (): Entries => {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(PERSISTED_STATE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeEntries = (entries: Entries) => {
  try {
    if (!Object.keys(entries).length) {
      window.sessionStorage.removeItem(PERSISTED_STATE_KEY);
      return;
    }
    window.sessionStorage.setItem(PERSISTED_STATE_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable or full, in which case the form simply is not restored.
  }
};

export const readSnapshot = (key: string): Snapshot | null => {
  const stored = readEntries()[key];

  if (!stored || typeof stored.submitted !== 'string') {
    return null;
  }

  const submitted = new URLSearchParams(stored.submitted);

  return {
    address: typeof stored.address === 'string' ? stored.address : null,
    end: parseDate(stored.end),
    endDisabled: stored.endDisabled === true,
    eventTypes: Array.isArray(stored.eventTypes) ? stored.eventTypes : [],
    free: stored.free === true,
    keyword: typeof stored.keyword === 'string' ? stored.keyword : '',
    languages: Array.isArray(stored.languages) ? stored.languages : [],
    locations: Array.isArray(stored.locations) ? stored.locations : [],
    page: parsePage(submitted),
    params: new URLSearchParams(typeof stored.params === 'string' ? stored.params : ''),
    remote: stored.remote === true,
    start: parseDate(stored.start),
    submitted,
    targetGroups: Array.isArray(stored.targetGroups) ? stored.targetGroups : [],
    topics: Array.isArray(stored.topics) ? stored.topics : [],
  };
};

export const writeSnapshot = (key: string, snapshot: Snapshot) => {
  const entries = readEntries();
  const { page: _page, ...values } = snapshot;

  entries[key] = {
    ...values,
    end: snapshot.end?.toISOString(),
    params: snapshot.params.toString(),
    start: snapshot.start?.toISOString(),
    submitted: snapshot.submitted.toString(),
    t: Date.now(),
  };

  // Keep ten most recently written entries.
  const kept = Object.entries(entries)
    .sort(([, a], [, b]) => (b?.t ?? 0) - (a?.t ?? 0))
    .slice(0, 10);

  writeEntries(Object.fromEntries(kept));
};

export const clearSnapshot = (key: string) => {
  const entries = readEntries();

  if (!(key in entries)) {
    return;
  }

  delete entries[key];
  writeEntries(entries);
};

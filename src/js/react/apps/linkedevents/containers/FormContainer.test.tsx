import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import { beforeEach, describe, expect, it } from 'vitest';
import { readEventListConfig } from '../helpers/ReadEventListConfig';
import { createEventsStore } from '../store';
import FormContainer from './FormContainer';

// Every filter turned on, so the test covers each id-emitting component at once and keeps
// covering new ones as filters are added.
const allFiltersOn = {
  event_list_layout: 'default' as const,
  event_list_type: 'events_and_hobbies' as const,
  events_api_url: 'https://api.hel.fi/linkedevents/v1/event/?page=1',
  events_public_url: 'https://tapahtumat.hel.fi',
  field_event_count: '3',
  field_event_list_title: 'Events',
  field_event_location: true,
  field_event_time: true,
  field_filter_keywords: [{ id: 'yso:p1235', name: 'elokuvat' }],
  field_free_events: true,
  field_language: true,
  field_remote_events: true,
  field_search_term: true,
  hideHeading: false,
  hidePagination: false,
  hobbies_public_url: 'https://harrastukset.hel.fi',
  places: {},
  removeBloatingEvents: false,
  use_fixtures: false as const,
  useCrossInstitutionalStudiesForm: false,
  useFullLocationFilter: false,
  useFullTopicsFilter: false,
  useLocationSearch: true,
  useTargetGroupFilter: true,
};

const embed = (paragraphId: string, index: number) => {
  const element = document.createElement('div');
  element.dataset.paragraphId = paragraphId;

  const config = readEventListConfig(element, { index, search: '' });
  if (!config) {
    throw new Error(`no config for ${paragraphId}`);
  }

  return (
    <Provider store={createEventsStore(config)}>
      <FormContainer />
    </Provider>
  );
};

beforeEach(() => {
  drupalSettings.helfi_events.data = { '1375': allFiltersOn, '1402': allFiltersOn };
});

describe('two event list forms on one page', () => {
  it('renders no duplicate element ids', () => {
    const { container } = render(
      <>
        {embed('1375', 0)}
        {embed('1402', 1)}
      </>,
    );
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);

    expect(ids.length).toBeGreaterThan(5);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every label pointing at exactly one element', () => {
    const { container } = render(
      <>
        {embed('1375', 0)}
        {embed('1402', 1)}
      </>,
    );
    const labels = [...container.querySelectorAll('label[for]')];

    expect(labels).not.toHaveLength(0);
    labels.forEach((label) => {
      expect(container.querySelectorAll(`[id="${label.getAttribute('for')}"]`)).toHaveLength(1);
    });
  });
});

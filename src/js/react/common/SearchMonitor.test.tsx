import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type TagType from '@/types/TagType';
import SearchMonitor, { type NotificationMethod } from './SearchMonitor';

const texts = {
  tosCheckboxLabel: 'I accept the terms',
  tosLinkText: 'Terms of service',
  tosLinkUrl: 'https://example.com/tos.pdf',
  noSelectionsNotification: 'Please make a selection first.',
};

type HarnessProps = {
  selectionTags?: TagType[];
  enabledNotificationMethods?: NotificationMethod[];
  elasticQuery?: string;
};

function Harness({ selectionTags = [{ tag: 'Culture' }], ...props }: HarnessProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      <SearchMonitor
        apiUrl='/subscribe'
        dialogTargetRef={ref}
        elasticQuery='{"q":1}'
        selectionTags={selectionTags}
        texts={texts}
        {...props}
      />
    </div>
  );
}

const openDialog = (container: HTMLElement) =>
  fireEvent.click(container.querySelector('.hdbt-search__search-monitor__button') as Element);

const fillEmail = (container: HTMLElement, value: string) =>
  fireEvent.change(container.querySelector('#hdbt-search__search-monitor__email') as Element, { target: { value } });

const agreeToTerms = (container: HTMLElement) =>
  fireEvent.click(container.querySelector('#hdbt-search__search-monitor__terms') as Element);

const submit = (container: HTMLElement) =>
  fireEvent.click(container.querySelector('#hdbt-search__search-monitor__submit-button') as Element);

describe('SearchMonitor', () => {
  afterEach(() => vi.restoreAllMocks());

  test('opens the subscription form when the trigger button is clicked', async () => {
    const { container } = render(<Harness />);
    openDialog(container);
    await waitFor(() => expect(container.querySelector('#hdbt-search__search-monitor__email')).not.toBeNull());
    expect(container.querySelector('#hdbt-search__search-monitor__terms')).not.toBeNull();
    expect(container.querySelector('#hdbt-search__search-monitor__submit-button')).not.toBeNull();
  });

  test('shows the no-selections notification when there are no tags', async () => {
    const { container, getByText } = render(<Harness selectionTags={[]} />);
    openDialog(container);
    await waitFor(() => expect(getByText('Please make a selection first.')).toBeTruthy());
  });

  test('renders the selected criteria as tags', async () => {
    const { container, getByText } = render(<Harness selectionTags={[{ tag: 'Culture' }, { tag: 'Sports' }]} />);
    openDialog(container);
    await waitFor(() => expect(getByText('Culture')).toBeTruthy());
    expect(getByText('Sports')).toBeTruthy();
  });

  test('blocks submission and lists validation errors when the form is incomplete', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const { container, getByText } = render(<Harness />);
    openDialog(container);
    await waitFor(() => expect(container.querySelector('#hdbt-search__search-monitor__submit-button')).not.toBeNull());
    submit(container);
    await waitFor(() => expect(getByText('Please check these selections')).toBeTruthy());
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('posts the subscription and shows the success view on a valid submit', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchSpy);
    const { container, getByText } = render(<Harness />);
    openDialog(container);
    await waitFor(() => expect(container.querySelector('#hdbt-search__search-monitor__email')).not.toBeNull());
    fillEmail(container, 'user@example.com');
    agreeToTerms(container);
    submit(container);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/subscribe', expect.objectContaining({ method: 'POST' })),
    );
    await waitFor(() => expect(getByText('You are almost done subscribing to search alert')).toBeTruthy());
  });

  test('shows an error message when the API rejects the subscription', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { container, getByText } = render(<Harness />);
    openDialog(container);
    await waitFor(() => expect(container.querySelector('#hdbt-search__search-monitor__email')).not.toBeNull());
    fillEmail(container, 'user@example.com');
    agreeToTerms(container);
    submit(container);
    await waitFor(() => expect(getByText('Search alert subscription failed. Please try again.')).toBeTruthy());
  });
});

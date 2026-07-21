import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import CookieComplianceStatement from './CookieComplianceStatement';

describe('CookieComplianceStatement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleanup the optional global set by some tests
    window.hdsCookieConsentClickEvent = undefined;
  });

  test('renders the host in the explanatory message', () => {
    const { getByText } = render(<CookieComplianceStatement host='YouTube' />);
    expect(getByText(/This content is hosted by YouTube/)).toBeTruthy();
  });

  test('renders the source link only when a source url is given', () => {
    const { container, rerender } = render(<CookieComplianceStatement host='YouTube' />);
    expect(container.querySelector('a[data-is-external="true"]')).toBeNull();
    rerender(<CookieComplianceStatement host='YouTube' sourceUrl='https://youtu.be/x' />);
    expect(container.querySelector('a[data-is-external="true"]')?.getAttribute('href')).toBe('https://youtu.be/x');
  });

  test('renders the policy link only when a policy url is given', () => {
    const { container } = render(<CookieComplianceStatement host='YouTube' policyUrl='/cookies' />);
    const link = container.querySelector('a[data-cookie-consent-groups]');
    expect(link?.getAttribute('href')).toBe('/cookies');
  });

  test('invokes the cookie consent handler when the policy link is clicked', () => {
    const handler = vi.fn();
    window.hdsCookieConsentClickEvent = handler;
    const { container } = render(<CookieComplianceStatement host='YouTube' policyUrl='/cookies' />);
    fireEvent.click(container.querySelector('a[data-cookie-consent-groups]') as Element);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('warns when the cookie consent handler is not defined', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<CookieComplianceStatement host='YouTube' policyUrl='/cookies' />);
    fireEvent.click(container.querySelector('a[data-cookie-consent-groups]') as Element);
    expect(warn).toHaveBeenCalledWith('hdsCookieConsentClickEvent is not defined');
  });
});

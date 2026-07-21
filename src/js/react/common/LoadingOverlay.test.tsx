import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay', () => {
  test('renders an assertive live region with hidden loading text', () => {
    const { container, getByText } = render(<LoadingOverlay />);
    const overlay = container.querySelector('.hdbt__loading-overlay');
    expect(overlay?.getAttribute('aria-live')).toBe('assertive');
    expect(overlay?.getAttribute('aria-atomic')).toBe('true');
    expect(getByText('Search results are loading').className).toContain('visually-hidden');
  });
});

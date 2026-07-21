import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { GhostList } from './GhostList';

// GhostList is the most widely imported common component (loading skeleton used
// by every search result listing). It renders `count` CardGhost placeholders
// inside an aria-live region.
describe('GhostList', () => {
  test('renders `count` ghost cards', () => {
    const { container } = render(<GhostList count={3} />);
    expect(container.querySelectorAll('.card--ghost')).toHaveLength(3);
  });

  test('renders no ghost cards when count is 0', () => {
    const { container } = render(<GhostList count={0} />);
    expect(container.querySelectorAll('.card--ghost')).toHaveLength(0);
  });

  test('exposes an assertive, atomic live region for screen readers', () => {
    const { container } = render(<GhostList count={1} />);
    const region = container.firstElementChild;
    expect(region?.getAttribute('aria-live')).toBe('assertive');
    expect(region?.getAttribute('aria-atomic')).toBe('true');
  });

  test('renders the visually hidden loading text', () => {
    const { getByText } = render(<GhostList count={1} />);
    // Drupal.t is stubbed in setupTests to echo its key back.
    expect(getByText('Search results are loading').className).toContain('visually-hidden');
  });

  test('applies the modifier class to the wrapper', () => {
    const { container } = render(<GhostList count={1} modifierClass='news-list' />);
    expect(container.firstElementChild?.className).toBe('news-list');
  });

  test('has no wrapper class when no modifier is given', () => {
    const { container } = render(<GhostList count={1} />);
    expect(container.firstElementChild?.className).toBe('');
  });

  test('forwards the bordered flag to the ghost cards', () => {
    const { container } = render(<GhostList count={2} bordered />);
    expect(container.querySelectorAll('.card--ghost.card--border')).toHaveLength(2);
  });

  test('forwards the simple flag to the ghost cards and omits the image', () => {
    const { container } = render(<GhostList count={1} variant='simple' />);
    expect(container.querySelectorAll('.card--ghost--simple')).toHaveLength(1);
    expect(container.querySelector('.card__image')).toBeNull();
  });
});

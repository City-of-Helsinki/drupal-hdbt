import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  test('renders the icon class for the given icon name', () => {
    const { container } = render(<Icon icon='clock' />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('hel-icon--clock');
    expect(span?.getAttribute('aria-hidden')).toBe('false');
  });

  test('appends a custom class name', () => {
    const { container } = render(<Icon icon='clock' className='card__meta__icon' />);
    expect(container.querySelector('span')?.className).toContain('card__meta__icon');
  });

  test('renders a hidden label and hides the icon from screen readers when labelled', () => {
    const { getByText, container } = render(<Icon icon='clock' label='Time' />);
    expect(getByText('Time').className).toContain('is-hidden');
    expect(container.querySelector('.hel-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  test('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<Icon icon='clock' onClick={onClick} />);
    fireEvent.click(container.querySelector('.hel-icon') as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Collapsible from './Collapsible';

const renderCollapsible = (props: Partial<Parameters<typeof Collapsible>[0]> = {}) =>
  render(
    <Collapsible id='filter' label='Filter' title='All dates' {...props}>
      <button type='button'>Apply</button>
    </Collapsible>,
  );

describe('Collapsible', () => {
  test('renders the label, title and control collapsed by default', () => {
    const { container, getByText } = renderCollapsible();
    expect(getByText('Filter')).toBeTruthy();
    const control = container.querySelector('.collapsible__control');
    expect(control?.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  test('opens the dialog when the control is clicked', () => {
    const { container, getByText } = renderCollapsible();
    fireEvent.click(container.querySelector('.collapsible__control') as Element);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(getByText('Apply')).toBeTruthy();
  });

  test('starts open when active is set', () => {
    const { container } = renderCollapsible({ active: true });
    expect(container.querySelector('.collapsible__control')?.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });

  test('closes again when the control is toggled', () => {
    const { container } = renderCollapsible({ active: true });
    fireEvent.click(container.querySelector('.collapsible__control') as Element);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  test('renders the placeholder modifier and helper text', () => {
    const { container, getByText } = renderCollapsible({ isPlaceholder: true, helper: 'Pick a range' });
    expect(container.querySelector('.collapsible__title--placeholder')).not.toBeNull();
    expect(getByText('Pick a range')).toBeTruthy();
  });

  test('hides the toggle handle when showHandle is false', () => {
    const { container } = renderCollapsible({ showHandle: false });
    expect(container.querySelector('.collapsible__handle')).toBeNull();
  });
});

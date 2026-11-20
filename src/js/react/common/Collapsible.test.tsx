import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Collapsible from './Collapsible';

const renderCollapsible = (props: Partial<Parameters<typeof Collapsible>[0]> = {}) =>
  render(
    <Collapsible id='filter' label='Filter' title='All dates' {...props}>
      <button type='button'>Apply</button>
    </Collapsible>,
  );

const getPanel = (container: HTMLElement) => container.querySelector('.collapsible__children');

describe('Collapsible', () => {
  test('renders the label, title and control collapsed by default', () => {
    const { container, getByText } = renderCollapsible();
    expect(getByText('Filter')).toBeTruthy();
    const control = container.querySelector('.collapsible__control');
    expect(control?.getAttribute('aria-expanded')).toBe('false');
    expect(getPanel(container)).toBeNull();
  });

  test('opens the panel when the control is clicked', () => {
    const { container, getByText } = renderCollapsible();
    fireEvent.click(container.querySelector('.collapsible__control') as Element);
    expect(getPanel(container)).not.toBeNull();
    expect(getByText('Apply')).toBeTruthy();
  });

  test('points aria-controls to the panel', () => {
    const { container } = renderCollapsible({ active: true });
    const control = container.querySelector('.collapsible__control');
    expect(control?.getAttribute('aria-controls')).toBe('filter-panel');
    expect(getPanel(container)?.id).toBe('filter-panel');
  });

  test('uses the given aria-controls value', () => {
    const { container } = renderCollapsible({ ariaControls: 'custom-target' });
    expect(container.querySelector('.collapsible__control')?.getAttribute('aria-controls')).toBe('custom-target');
  });

  test('starts open when active is set', () => {
    const { container } = renderCollapsible({ active: true });
    expect(container.querySelector('.collapsible__control')?.getAttribute('aria-expanded')).toBe('true');
    expect(getPanel(container)).not.toBeNull();
  });

  test('closes again when the control is toggled', () => {
    const { container } = renderCollapsible({ active: true });
    fireEvent.click(container.querySelector('.collapsible__control') as Element);
    expect(getPanel(container)).toBeNull();
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

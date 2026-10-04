import { act, fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import TabList from './TabList';

const tabs = [
  { value: 'first', id: 'tab-first', controls: 'panel-first', label: 'First' },
  { value: 'second', id: 'tab-second', controls: 'panel-second', label: 'Second' },
  { value: 'third', id: 'tab-third', controls: 'panel-third', label: 'Third' },
];

const ControlledTabList = ({ onSelect }: { onSelect?: (value: string) => void }) => {
  const [selected, setSelected] = useState('first');
  return (
    <TabList
      label='Test tabs'
      tabs={tabs}
      selected={selected}
      onSelect={(value) => {
        setSelected(value);
        onSelect?.(value);
      }}
    />
  );
};

describe('TabList', () => {
  test('renders a labelled tablist with tabs', () => {
    const { getByRole, getAllByRole } = render(<ControlledTabList />);
    expect(getByRole('tablist').getAttribute('aria-label')).toBe('Test tabs');
    expect(getAllByRole('tab')).toHaveLength(3);
  });

  test('only the selected tab is in the tab sequence', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [first, second, third] = getAllByRole('tab');
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(second.getAttribute('tabindex')).toBe('-1');
    expect(third.getAttribute('tabindex')).toBe('-1');
  });

  test('the focused tab is tabbable while focus is in the tablist', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [first, second] = getAllByRole('tab');
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(second);
    expect(first.getAttribute('tabindex')).toBe('-1');
    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('aria-selected')).toBe('true');
  });

  test('the selected tab is tabbable again when focus leaves the tablist', () => {
    const { getAllByRole, getByRole } = render(
      <>
        <ControlledTabList />
        <button type='button'>Outside</button>
      </>,
    );
    const [first, second] = getAllByRole('tab');
    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    act(() => getByRole('button', { name: 'Outside' }).focus());
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(second.getAttribute('tabindex')).toBe('-1');
  });

  test('sets aria-controls and id on tabs', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [first] = getAllByRole('tab');
    expect(first.id).toBe('tab-first');
    expect(first.getAttribute('aria-controls')).toBe('panel-first');
  });

  test('ArrowRight moves focus to the next tab without selecting it, wrapping at the end', () => {
    const onSelect = vi.fn();
    const { getAllByRole } = render(<ControlledTabList onSelect={onSelect} />);
    const [first, second, third] = getAllByRole('tab');

    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(second);
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(second.getAttribute('aria-selected')).toBe('false');

    fireEvent.keyDown(second, { key: 'ArrowRight' });
    fireEvent.keyDown(third, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(first);
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('ArrowLeft moves focus to the previous tab, wrapping at the start', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [first, , third] = getAllByRole('tab');

    fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(third);
    expect(third.getAttribute('aria-selected')).toBe('false');
  });

  test('Home and End move focus to the first and last tab', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [first, , third] = getAllByRole('tab');

    fireEvent.keyDown(first, { key: 'End' });
    expect(document.activeElement).toBe(third);

    fireEvent.keyDown(third, { key: 'Home' });
    expect(document.activeElement).toBe(first);
  });

  test('other keys are ignored', () => {
    const onSelect = vi.fn();
    const { getAllByRole } = render(<ControlledTabList onSelect={onSelect} />);
    fireEvent.keyDown(getAllByRole('tab')[0], { key: 'ArrowDown' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('clicking a tab selects it', () => {
    const { getAllByRole } = render(<ControlledTabList />);
    const [, second] = getAllByRole('tab');
    fireEvent.click(second);
    expect(second.getAttribute('aria-selected')).toBe('true');
    expect(second.getAttribute('tabindex')).toBe('0');
  });
});

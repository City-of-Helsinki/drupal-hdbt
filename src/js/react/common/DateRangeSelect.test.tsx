import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { DateRangeSelect } from './DateRangeSelect';

const setup = (props: Partial<Parameters<typeof DateRangeSelect>[0]> = {}) => {
  const handlers = { setStart: vi.fn(), setEnd: vi.fn(), setEndDisabled: vi.fn() };
  const utils = render(<DateRangeSelect id='dr' label='Dates' {...handlers} {...props} />);
  fireEvent.click(utils.container.querySelector('.collapsible__control') as Element);
  const typeInto = (selector: string, value: string) => {
    const input = utils.container.querySelector(selector) as HTMLInputElement;
    fireEvent.input(input, { target: { value } });
    fireEvent.blur(input);
  };
  return { ...utils, ...handlers, typeInto };
};

describe('DateRangeSelect', () => {
  afterEach(() => vi.restoreAllMocks());

  test('shows the "all dates" placeholder title when no dates are selected', () => {
    const { container } = render(
      <DateRangeSelect id='dr' label='Dates' setStart={vi.fn()} setEnd={vi.fn()} setEndDisabled={vi.fn()} />,
    );
    expect(container.querySelector('.collapsible__title--placeholder')).not.toBeNull();
    expect(container.textContent).toContain('All dates');
  });

  test('shows the selected range in the title', () => {
    const { container } = render(
      <DateRangeSelect
        id='dr'
        label='Dates'
        startDate='5.3.2026'
        endDate='9.3.2026'
        setStart={vi.fn()}
        setEnd={vi.fn()}
        setEndDisabled={vi.fn()}
      />,
    );
    expect(container.textContent).toContain('5.3.2026 - 9.3.2026');
  });

  test('propagates a valid start date', () => {
    const { setStart, typeInto } = setup();
    typeInto('#start-date', '5.3.2026');
    expect(setStart).toHaveBeenCalledWith('5.3.2026');
  });

  test('rejects an invalid start date without propagating it', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { setStart, typeInto } = setup();
    typeInto('#start-date', '31.2.2026');
    expect(setStart).not.toHaveBeenCalled();
  });

  test('clamps the end date when the chosen start date is past it', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { setEnd, typeInto } = setup({ endDate: '5.3.2026' });
    typeInto('#start-date', '10.3.2026');
    expect(setEnd).toHaveBeenCalledWith('11.3.2026');
  });

  test('enabling the same-day checkbox clears the end date and hides its input', () => {
    const { container, setEnd, setEndDisabled } = setup({ endDate: '9.3.2026' });
    fireEvent.click(container.querySelector('#date-range-select__end-date-disabled') as Element);
    expect(setEndDisabled).toHaveBeenCalledWith(true);
    expect(setEnd).toHaveBeenCalledWith(undefined);
  });

  test('does not render the end date input when end is disabled', () => {
    const { container } = setup({ endDisabled: true });
    expect(container.querySelector('#end-date')).toBeNull();
  });
});

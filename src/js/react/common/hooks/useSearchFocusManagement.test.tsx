import { act, render } from '@testing-library/react';
import { beforeAll, describe, expect, test } from 'vitest';
import useSearchFocusManagement from './useSearchFocusManagement';

type HarnessProps = {
  isValidating: boolean;
  queryString: string;
  data?: object;
  trigger: object;
};

const Harness = ({ isValidating, queryString, data, trigger }: HarnessProps) => {
  const { scrollTarget } = useSearchFocusManagement(isValidating, queryString, data, undefined, trigger);
  return (
    <>
      <button type='button'>Tab</button>
      <div ref={scrollTarget}>Results</div>
    </>
  );
};

const focusTab = (getByRole: (role: string) => HTMLElement) => {
  const tab = getByRole('button');
  act(() => tab.focus());
  return tab;
};

describe('useSearchFocusManagement', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = () => {};
  });

  test('does not move focus on the initial load', () => {
    const trigger = {};
    const { rerender, getByRole } = render(<Harness isValidating queryString='q' trigger={trigger} />);
    const tab = focusTab(getByRole);
    rerender(<Harness isValidating={false} queryString='q' data={{}} trigger={trigger} />);
    expect(document.activeElement).toBe(tab);
  });

  test('does not move focus when cached data is revalidated after a remount', () => {
    const trigger = {};
    const data = {};
    // Remounted with cached data: not validating on the first render.
    const { rerender, getByRole } = render(
      <Harness isValidating={false} queryString='q' data={data} trigger={trigger} />,
    );
    const tab = focusTab(getByRole);
    rerender(<Harness isValidating queryString='q' data={data} trigger={trigger} />);
    rerender(<Harness isValidating={false} queryString='q' data={{ ...data }} trigger={trigger} />);
    expect(document.activeElement).toBe(tab);
  });

  test('moves focus to the results heading after a user started search', () => {
    const data = {};
    const { rerender, getByRole, getByText } = render(
      <Harness isValidating={false} queryString='q' data={data} trigger={{}} />,
    );
    focusTab(getByRole);
    const newTrigger = { keyword: 'school' };
    rerender(<Harness isValidating queryString='q2' data={data} trigger={newTrigger} />);
    rerender(<Harness isValidating={false} queryString='q2' data={{ hits: 1 }} trigger={newTrigger} />);
    expect(document.activeElement).toBe(getByText('Results'));
  });
});

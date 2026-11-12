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

type PagerHarnessProps = {
  isValidating: boolean;
  page: number;
  cards: { title: string; url?: string; links?: string[] }[];
  // Changes only on submit, not on page changes, like in site search.
  trigger?: number;
};

const PagerHarness = ({ isValidating, page, cards, trigger = 0 }: PagerHarnessProps) => {
  const { scrollTarget, resultsListRef, onPageChange } = useSearchFocusManagement(
    isValidating,
    `q::${page}`,
    { page },
    undefined,
    trigger,
    false,
  );
  return (
    <>
      <button type='button' onClick={onPageChange}>
        Next page
      </button>
      <div ref={scrollTarget}>Results</div>
      <div ref={resultsListRef}>
        {cards.map(({ title, url, links = [] }) => (
          <div className='card' key={title}>
            <h3 className='card__title'>{url ? <a href={url}>{title}</a> : title}</h3>
            {links.map((link) => (
              <a key={link} href={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
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

  describe('pager focus', () => {
    const changePage = (cards: PagerHarnessProps['cards']) => {
      const { rerender, getByRole } = render(<PagerHarness isValidating={false} page={1} cards={[]} />);
      act(() => getByRole('button').click());
      rerender(<PagerHarness isValidating page={2} cards={[]} />);
      rerender(<PagerHarness isValidating={false} page={2} cards={cards} />);
    };

    test('moves focus to the link of the first card', () => {
      changePage([
        { title: 'First', url: '/first' },
        { title: 'Second', url: '/second' },
      ]);
      expect(document.activeElement?.textContent).toBe('First');
      expect(document.activeElement?.tagName).toBe('A');
    });

    test('moves focus to the title of the first card when it has no link', () => {
      changePage([{ title: 'Contact' }, { title: 'Page', url: '/page' }]);
      expect(document.activeElement?.textContent).toBe('Contact');
      expect(document.activeElement?.tagName).toBe('H3');
    });

    test('moves focus to the title of the first card instead of its other links', () => {
      changePage([{ title: 'Contact', links: ['tel:0912345', 'mailto:contact@hel.fi'] }]);
      expect(document.activeElement?.textContent).toBe('Contact');
      expect(document.activeElement?.tagName).toBe('H3');
    });

    test('moves focus to the title link of the first card when the card has other links', () => {
      changePage([{ title: 'Contact', url: '/contact', links: ['tel:0912345'] }]);
      expect(document.activeElement?.textContent).toBe('Contact');
      expect(document.activeElement?.tagName).toBe('A');
    });

    test('moves focus to the results heading when the search is resubmitted after a page change', () => {
      const page1 = [{ title: 'Result on page 1', url: '/page-1' }];
      const page2 = [{ title: 'Result on page 2', url: '/page-2' }];

      // The first search completes.
      const { rerender, getByRole, getByText } = render(<PagerHarness isValidating page={1} cards={[]} />);
      rerender(<PagerHarness isValidating={false} page={1} cards={page1} />);

      // Page change.
      act(() => getByRole('button').click());
      rerender(<PagerHarness isValidating page={2} cards={page1} />);
      rerender(<PagerHarness isValidating={false} page={2} cards={page2} />);
      expect(document.activeElement?.textContent).toBe('Result on page 2');

      // The unchanged search is resubmitted, which returns to the first page.
      rerender(<PagerHarness isValidating page={1} cards={page2} trigger={1} />);
      rerender(<PagerHarness isValidating={false} page={1} cards={page1} trigger={1} />);
      expect(document.activeElement).toBe(getByText('Results'));
    });
  });
});

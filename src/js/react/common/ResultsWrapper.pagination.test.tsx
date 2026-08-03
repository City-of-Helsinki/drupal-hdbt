// biome-ignore-all lint/suspicious/noExplicitAny: tests use minimal Elastic response stubs
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { describe, expect, test } from 'vitest';
import { ResultsWrapper } from './ResultsWrapper';

const dataFor = (page: number) => ({
  hits: { total: { value: 25 }, hits: [{ _id: `p${page}-first` }, { _id: `p${page}-second` }] },
});

// ResultsWrapper owns the pager focus handling itself, so a consumer only has to
// keep the page in state.
const SearchApp = () => {
  const [page, setPage] = useState(1);
  const queryString = JSON.stringify({ page });

  const { data, error, isLoading } = useSWR(
    queryString,
    async (key: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return dataFor(JSON.parse(key).page);
    },
    { revalidateOnFocus: false },
  );

  return (
    <ResultsWrapper
      currentPage={page}
      data={data as any}
      error={error}
      getHeaderText={() => '2 results'}
      isValidating={isLoading}
      queryString={queryString}
      resultItemCallBack={(item: any) => (
        <div key={item._id}>
          <a href={`/${item._id}`}>{item._id}</a>
        </div>
      )}
      setPage={(value: string) => setPage(Number(value))}
      size={10}
      trigger={queryString}
    />
  );
};

const clickPage = (page: string) => {
  const link = Array.from(document.querySelectorAll('.hds-pagination__item-link')).find(
    (el) => el.textContent === page,
  ) as HTMLElement;
  fireEvent.click(link);
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('ResultsWrapper pager focus', () => {
  test('moves focus to the first result of the page, also when it comes from the SWR cache', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SearchApp />
      </SWRConfig>,
    );

    // Initial load must not steal focus.
    await screen.findByText('p1-first');
    await settle();
    expect(document.activeElement).toBe(document.body);

    // Page that has to be fetched: ghost cards appear, then the first result wins.
    clickPage('2');
    await screen.findByText('p2-first');
    await settle();
    expect(document.activeElement?.textContent).toBe('p2-first');

    // Page served from the cache: SWR can skip the request entirely (deduped), so
    // there is no isValidating transition to react to.
    clickPage('1');
    await screen.findByText('p1-first');
    await settle();
    expect(document.activeElement?.textContent).toBe('p1-first');
  });
});

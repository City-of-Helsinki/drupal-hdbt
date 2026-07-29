import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { AggregationItem } from '@/types/Aggregation';
import ResultsMap from './ResultsMap';

const ids = (keys: string[]): AggregationItem[] => keys.map((key) => ({ key, doc_count: 1 }));

const mapSrc = (container: HTMLElement) => container.querySelector('iframe')?.getAttribute('src') ?? '';

describe('ResultsMap', () => {
  test('uses the search embed url when no ids are given', () => {
    const { container } = render(<ResultsMap />);
    expect(mapSrc(container)).toBe('https://palvelukartta.hel.fi/fi/embed/search');
  });

  test('links to a single unit when there is exactly one id', () => {
    const { container } = render(<ResultsMap ids={ids(['123'])} />);
    expect(mapSrc(container)).toBe('https://palvelukartta.hel.fi/fi/embed/unit/123');
  });

  test('passes the unit ids as a query param for a small set', () => {
    const { container } = render(<ResultsMap ids={ids(['1', '2', '3'])} />);
    expect(mapSrc(container)).toContain('units=1%2C2%2C3');
  });

  test('falls back to service node params above the id threshold', () => {
    const { container } = render(<ResultsMap ids={ids(Array.from({ length: 91 }, (_, i) => `${i}`))} />);
    const src = mapSrc(container);
    expect(src).toContain('service_node=1100%2C1110%2C11187');
    expect(src).toContain('city=helsinki');
    expect(src).not.toContain('units=');
  });

  test('renders an external link to open the full map', () => {
    const { container } = render(<ResultsMap ids={ids(['123'])} />);
    const link = container.querySelector('a[data-is-external="true"]');
    expect(link?.getAttribute('href')).toBe('https://palvelukartta.hel.fi/fi/embed/unit/123');
  });
});

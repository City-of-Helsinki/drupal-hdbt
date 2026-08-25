import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import LinkedEvents from '@/react/common/enum/LinkedEvents';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import { useMainCategoryIds } from './useMainCategoryIds';

vi.mock('@/react/common/hooks/useTimeoutFetch', () => ({ default: vi.fn() }));

const mockedFetch = vi.mocked(useTimeoutFetch);

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

const jsonResponse = (body: unknown, status = 200) => ({ status, json: async () => body }) as unknown as Response;

describe('useMainCategoryIds', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  test('fetches the topics set for events', async () => {
    mockedFetch.mockResolvedValue(jsonResponse({ keywords: [{ id: 'yso:p1808' }, { id: 'yso:p14004' }] }));

    const { result } = renderHook(() => useMainCategoryIds('General'), { wrapper });

    await waitFor(() => expect(result.current.has('yso:p1808')).toBe(true));
    expect(result.current.has('yso:p14004')).toBe(true);
    expect(mockedFetch).toHaveBeenCalledWith(LinkedEvents.MAIN_CATEGORY_URLS.General);
  });

  test('fetches the courses set for Course events', async () => {
    mockedFetch.mockResolvedValue(jsonResponse({ keywords: [{ id: 'yso:p9270' }] }));

    const { result } = renderHook(() => useMainCategoryIds('Course'), { wrapper });

    await waitFor(() => expect(result.current.has('yso:p9270')).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith(LinkedEvents.MAIN_CATEGORY_URLS.Course);
  });

  test('returns an empty set when the request fails', async () => {
    mockedFetch.mockResolvedValue(jsonResponse({}, 500));

    const { result } = renderHook(() => useMainCategoryIds('General'), { wrapper });

    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    expect(result.current.size).toBe(0);
  });
});

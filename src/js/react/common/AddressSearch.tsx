import { SearchInput } from 'hds-react';
import { useMemo, useRef } from 'react';
import { defaultSearchInputStyle } from '@/react/common/constants/searchInputStyle';
import type { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import getNameTranslation from './helpers/ServiceMap';

export type AddressWithCoordinates = { label: string; value: [number, number, string] };
type SubmitHandler<T> = T extends true ? (address: AddressWithCoordinates) => void : (address: string) => void;

export const AddressSearch = ({
  className,
  includeCoordinates = false,
  loadingSpinnerFinishedText = Drupal.t(
    'Finished loading suggestions',
    {},
    { context: 'Loading finished indicator for suggestive search' },
  ),
  loadingSpinnerText = Drupal.t('Loading suggestions...', {}, { context: 'Loading indicator for suggestive search' }),
  onSubmit,
  searchInputClassname,
  value,
  ...rest
}: {
  className?: string;
  includeCoordinates?: boolean;
  onSubmit: SubmitHandler<typeof includeCoordinates>;
  searchInputClassname?: string;
} & Omit<React.ComponentProps<typeof SearchInput>, 'suggestionLabelField' | 'getSuggestions' | 'onSubmit'>) => {
  const addressMapRef = useRef<Map<string, unknown>>(new Map());
  const debounceTimeoutRef = useRef<number | null>(null);
  const requestSequenceRef = useRef<number>(0);

  const getSuggestions = async (searchTerm?: string) => {
    if (!searchTerm || searchTerm === '') {
      return [];
    }
    // Palvelukartta address search only allows specific characters.
    searchTerm = searchTerm.replace(/[^a-zA-Z0-9.,+&'|\-\s]*/g, '');

    // Fetch suggestions only if there's a non-empty search term.
    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current);
    }

    // Increment the request sequence number and remember it.
    // This is used to identify whether a newer request has started
    // while we were waiting.
    const currentRequestSequence = ++requestSequenceRef.current;

    // Fetching suggestions is delayed by 700ms to avoid excessive server load.
    await new Promise<void>((resolve) => {
      debounceTimeoutRef.current = window.setTimeout(() => {
        resolve();
      }, 700);
    });

    // If a newer request started while we were waiting, ignore this one.
    if (currentRequestSequence !== requestSequenceRef.current) {
      return [];
    }
    const fetchSuggestions = (param: URLSearchParams) => {
      const url = new URL(ServiceMap.EVENTS_URL);
      url.search = param.toString();

      return fetch(url.toString()).then((response) => response.json());
    };

    const params = ['fi', 'sv'].map(
      (lang) =>
        new URLSearchParams({
          format: 'json',
          language: lang,
          municipality: 'helsinki',
          q: searchTerm,
          type: 'address',
        }),
    );

    const [fiParams, svParams] = params;
    const results = Promise.all([fetchSuggestions(fiParams), fetchSuggestions(svParams)]);

    const parseResults = (result: ServiceMapResponse<ServiceMapAddress>, langKey: string) =>
      result.results.map((addressResult) => {
        const resolvedName: string = getNameTranslation(addressResult.name, langKey) || '';
        if (includeCoordinates) {
          addressMapRef.current.set(resolvedName, addressResult.location?.coordinates);
        }

        return { label: resolvedName };
      });

    const [fiResults, svResults] = await results;

    // If a newer request completed first, ignore these results.
    if (currentRequestSequence !== requestSequenceRef.current) {
      return [];
    }

    return [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);
  };

  const handleSubmit = (address: string) => {
    if (includeCoordinates) {
      onSubmit({
        label: address,
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
        value: addressMapRef.current.has(address) ? [...(addressMapRef.current.get(address) as any), address] : null,
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      } as any);
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      onSubmit(address as any);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
  const searchInput = useMemo(
    () => (
      <SearchInput
        {...{ getSuggestions, loadingSpinnerText, loadingSpinnerFinishedText, value, ...rest }}
        className={searchInputClassname || 'hdbt-search__input hdbt-search__input--address'}
        onSubmit={handleSubmit}
        suggestionLabelField='label'
        style={defaultSearchInputStyle}
        hideSearchButton={true}
      />
    ),
    // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
    [value, getSuggestions],
  );

  return <div className={className || 'hdbt-search__filter'}>{searchInput}</div>;
};

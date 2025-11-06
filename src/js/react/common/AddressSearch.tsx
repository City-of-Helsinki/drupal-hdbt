import { SearchInput } from 'hds-react';
import { useMemo } from 'react';

import { defaultSearchInputStyle } from '@/react/common/constants/searchInputStyle';
import type { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import getNameTranslation from './helpers/ServiceMap';

type SubmitHandler<T> = T extends true
  ? (address: { label: string; value: [number, number, string] }) => void
  : (address: string) => void;

export const AddressSearch = ({
  className,
  includeCoordinates = false,
  loadingSpinnerFinishedText = Drupal.t(
    'Finished loading suggestions',
    {},
    { context: 'Loading finished indicator for suggestive search' },
  ),
  loadingSpinnerText = Drupal.t(
    'Loading suggestions...',
    {},
    { context: 'Loading indicator for suggestive search' },
  ),
  onSubmit,
  searchInputClassname,
  value,
  ...rest
}: {
  className?: string;
  includeCoordinates?: boolean;
  onSubmit: SubmitHandler<typeof includeCoordinates>;
  searchInputClassname?: string;
} & Omit<
  React.ComponentProps<typeof SearchInput>,
  'suggestionLabelField' | 'getSuggestions' | 'onSubmit'
>) => {
  const addressMap = new Map();

  const getSuggestions = async (searchTerm?: string) => {
    if (!searchTerm || searchTerm === '') {
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
    const results = Promise.all([
      fetchSuggestions(fiParams),
      fetchSuggestions(svParams),
    ]);

    const parseResults = (
      result: ServiceMapResponse<ServiceMapAddress>,
      langKey: string,
    ) =>
      result.results.map((addressResult) => {
        const resolvedName: string =
          getNameTranslation(addressResult.name, langKey) || '';
        if (includeCoordinates) {
          addressMap.set(resolvedName, addressResult.location?.coordinates);
        }

        return { label: resolvedName };
      });

    const [fiResults, svResults] = await results;

    return [
      ...parseResults(fiResults, 'fi'),
      ...parseResults(svResults, 'sv'),
    ].slice(0, 10);
  };

  const handleSubmit = (address: string) => {
    if (includeCoordinates) {
      onSubmit({
        label: address,
        value: addressMap.has(address)
          ? [...addressMap.get(address), address]
          : null,
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
      } as any);
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
      onSubmit(address as any);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12066
  const searchInput = useMemo(
    () => (
      <SearchInput
        {...{
          getSuggestions,
          loadingSpinnerText,
          loadingSpinnerFinishedText,
          value,
          ...rest,
        }}
        className={
          searchInputClassname ||
          'hdbt-search__input hdbt-search__input--address'
        }
        onSubmit={handleSubmit}
        suggestionLabelField='label'
        style={defaultSearchInputStyle}
      />
    ),
    // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12066
    [value, getSuggestions],
  );

  return (
    <div className={className || 'hdbt-search__filter'}>{searchInput}</div>
  );
};

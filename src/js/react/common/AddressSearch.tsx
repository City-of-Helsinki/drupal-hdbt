import { Search } from 'hds-react';
import { useCallback, useState } from 'react';
import { defaultSearchInputStyle } from '@/react/common/constants/searchInputStyle';
import type { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import getNameTranslation from './helpers/ServiceMap';

export type AddressWithCoordinates = { label: string; value: [number, number, string] };
type SubmitHandler<T> = T extends true ? (address: AddressWithCoordinates) => void : (address: string) => void;

type AddressSearchProps = {
  className?: string;
  clearButtonAriaLabel?: string;
  hideSearchButton?: boolean;
  includeCoordinates?: boolean;
  label?: string;
  onChange?: (value: string) => void;
  onSubmit: SubmitHandler<boolean>;
  searchInputClassname?: string;
  value?: string;
  visibleSuggestions?: number;
} & Omit<
  React.ComponentProps<typeof Search>,
  'onSearch' | 'onSend' | 'onChange' | 'value' | 'hideSubmitButton' | 'visibleOptions' | 'texts'
>;

export const AddressSearch = ({
  className,
  clearButtonAriaLabel,
  hideSearchButton,
  includeCoordinates = false,
  label,
  onChange,
  onSubmit,
  searchInputClassname,
  value,
  visibleSuggestions,
  ...rest
}: AddressSearchProps) => {
  const addressMap = new Map();

  const getSuggestions = useCallback(
    async (searchTerm?: string) => {
      if (!searchTerm || searchTerm === '') {
        return [];
      }
      searchTerm = searchTerm.replace(/[^a-zA-Z0-9.,+&'|\-\s]*/g, '');

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
            addressMap.set(resolvedName, addressResult.location?.coordinates);
          }
          return { label: resolvedName, value: resolvedName };
        });

      const [fiResults, svResults] = await results;
      return [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);
    },
    [includeCoordinates, addressMap.set],
  );

  const handleSend = (address: string) => {
    if (includeCoordinates) {
      onSubmit({
        label: address,
        value: addressMap.has(address) ? [...addressMap.get(address), address] : null,
        // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      } as any);
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      onSubmit(address as any);
    }
  };

  const [props] = useState({
    ...rest,
    className: searchInputClassname || 'hdbt-search__input hdbt-search__input--address',
    hideSubmitButton: hideSearchButton ?? true,
    style: defaultSearchInputStyle,
    texts: {
      ...(label ? { label: label } : {}),
      ...(clearButtonAriaLabel
        ? { clearButtonAriaLabel_one: clearButtonAriaLabel, clearButtonAriaLabel_multiple: clearButtonAriaLabel }
        : {}),
    },
  });

  return (
    <div className={className || 'hdbt-search__filter'}>
      <Search
        {...props}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onSearch={(searchValue) => getSuggestions(searchValue).then((options) => ({ options }))}
        onSend={handleSend}
        value={value}
        visibleOptions={visibleSuggestions}
      />
    </div>
  );
};

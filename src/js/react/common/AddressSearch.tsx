import { SearchInput } from 'hds-react';
import { CSSProperties } from 'react';

import { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import getNameTranslation from './helpers/ServiceMap';

type SubmitHandler<T> = T extends true ? (address: {label: string, value: [number, number, string]}) => void : (address: string) => void;

export const AddressSearch = ({
  className,
  includeCoordinates = false,
  searchInputClassname,
  loadingSpinnerFinishedText = Drupal.t('Finished loading suggestions', {}, { context: 'Loading finished indicator for suggestive search' }),
  loadingSpinnerText = Drupal.t('Loading suggestions...', {}, { context: 'Loading indicator for suggestive search' }),
  onSubmit,
  ...rest
}: {
  className?: string;
  includeCoordinates?: boolean;
  onSubmit: SubmitHandler<typeof includeCoordinates>;
  searchInputClassname?: string;
} & Omit<React.ComponentProps<typeof SearchInput>, 'suggestionLabelField' | 'getSuggestions'|'onSubmit'>) => {
  const addressMap = new Map();

  const getSuggestions = async(searchTerm?: string) => {
    if (!searchTerm || searchTerm === '') {
      return [];
    }

    const fetchSuggestions = (param: URLSearchParams) => {
      const url = new URL(ServiceMap.EVENTS_URL);
      url.search = param.toString();

      return fetch(url.toString()).then(response => response.json());
    };

    const params = ['fi', 'sv'].map(lang => new URLSearchParams({
      format: 'json',
      language: lang,
      municipality: 'helsinki',
      q: searchTerm,
      type: 'address',
    }));

    const [fiParams, svParams] = params;
    const results = Promise.all([
      fetchSuggestions(fiParams),
      fetchSuggestions(svParams)
    ]);

    const parseResults = (result: ServiceMapResponse<ServiceMapAddress>, langKey: string) => result.results.map(addressResult => {
      const resolvedName: string = getNameTranslation(addressResult.name, langKey) || '';
      if (includeCoordinates) {
        addressMap.set(resolvedName, addressResult.location?.coordinates);
      }

      return {label: resolvedName};
    });


    const [fiResults, svResults] = await results;

    const result = [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);

    return result;
  };

  const handleSubmit = (address: string) => {
    if (includeCoordinates) {
      onSubmit({
        label: address,
        value: addressMap.has(address) ? [...addressMap.get(address), address] : null
      } as any);
    }
    else {
      onSubmit(address as any);
    }
  };

  return (
    <div className={className || 'hdbt-search__filter'}>
      <SearchInput
        {...{
          getSuggestions,
          loadingSpinnerText,
          loadingSpinnerFinishedText,
          ...rest,
        }}
        className={searchInputClassname || 'hdbt-search__input hdbt-search__input--address'}
        onSubmit={handleSubmit}
        suggestionLabelField='label'
        style={
          {
            '--focus-outline-color': 'var(--hdbt-color-black)',
            '--color-focus-outline': 'var(--hdbt-color-black)',
            '--menu-item-background-hover': 'var(--hdbt-color-black)',
            '--menu-item-color-hover': 'var(--color-white)',
          } as CSSProperties
        }
      />
    </div>
  );
};

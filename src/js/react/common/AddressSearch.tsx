import { SearchInput } from 'hds-react';

import { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import getNameTranslation from './helpers/ServiceMap';

export const AddressSearch = ({
  className,
  searchInputClassname,
  loadingSpinnerFinishedText = Drupal.t('Finished loading suggestions', {}, { context: 'Loading finished indicator for suggestive search' }),
  loadingSpinnerText = Drupal.t('Loading suggestions...', {}, { context: 'Loading indicator for suggestive search' }),
  ...rest
}: {
  className?: string;
  searchInputClassname?: string;
} & Omit<React.ComponentProps<typeof SearchInput>, 'suggestionLabelField' | 'getSuggestions'>) => {

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
      page_size: '10',
      q: searchTerm,
      type: 'address',
    }));

    const [fiParams, svParams] = params;
    const results = Promise.all([
      fetchSuggestions(fiParams),
      fetchSuggestions(svParams)
    ]);

    const parseResults = (result: ServiceMapResponse<ServiceMapAddress>, langKey: string) => result.results.map(addressResult => ({
        value: getNameTranslation(addressResult.name, langKey) as string
      }));

    const [fiResults, svResults] = await results;

    const result = [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);
    return result;
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
        suggestionLabelField='value'
      />
    </div>
  );
};

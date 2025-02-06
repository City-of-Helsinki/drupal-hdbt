import { SearchInput } from 'hds-react';
import { useSetAtom } from 'jotai';
import { addressAtom } from '../store';
import getNameTranslation from '@/react/common/helpers/ServiceMap';
import { ServiceMapAddress, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from '@/react/common/enum/ServiceMap';

const AddressSearch = () => {
  const updateAddress = useSetAtom(addressAtom);

  const onChange = (value: string) => {
    updateAddress(value);
  };

  const getSuggestions = async(address: string|undefined) => {
    if (!address || address === '') {
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
      q: address,
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

    return [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);
  };

  return (
    <div className='hdbt-search__filter'>
      <SearchInput
        className='hdbt-search__input'
        getSuggestions={getSuggestions}
        hideSearchButton
        id='location'
        label={Drupal.t('Address', {}, {context: 'React search: location label'})}
        onChange={onChange}
        onSubmit={onChange}
        placeholder={Drupal.t('For example, Mannerheimintie 1', {}, {context: 'Helsinki near you'})}
        suggestionLabelField='value'
        visibleSuggestions={5}
      />
    </div>
  );
};

export default AddressSearch;

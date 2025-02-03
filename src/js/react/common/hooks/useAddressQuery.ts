import { ServiceMapAddress, ServiceMapResponse, TranslatedName } from '@/types/ServiceMap';
import API_URL from '../enum/ServiceMap';

const getNameTranslation = (names: TranslatedName, language: string|null) => {
  if (language && names[language as 'fi'|'sv'|'en']) {
    return names[language as 'fi'|'sv'|'en'];
  }

  if (names.fi) {
    return names.fi;
  }

  if (names.sv) {
    return names.sv;
  }

  throw new Error('No name found');
};

/**
 * Queries service map api for possible address names.
 *
 * @param {string|null} address Address to query
 * @param {number|string} pageSize Maximum number of results
 *
 * @return {array} Array of possible address names
 */
const useAddressQuery = async(address: string|null, pageSize: number|string = 10): Promise<Array<string>> => {
  if (!address) {
    return [];
  }

  const params = ['fi', 'sv'].map(lang => new URLSearchParams({
    format: 'json',
    language: 'fi',
    municipality: 'helsinki',
    page_size: pageSize.toString(),
    q: address,
    type: 'address',
  }));

  let addresses: string[] = [];

  params.forEach(async (param) => {
    const url = new URL(API_URL);
    url.search = param.toString();
    const response = await fetch(url.toString());

    if (response.status !== 200) {
      return;
    }

    const data: ServiceMapResponse<ServiceMapAddress> = await response.json();

    if (!data.results.length) {
      return;
    }

    addresses = [
      ...addresses,
      ...data.results.map(
        (result) => {
          const translation = getNameTranslation(result.name, param.get('language'));
          return translation || '';
        }
      ),
    ];
  });

  return addresses;
};

export default useAddressQuery;

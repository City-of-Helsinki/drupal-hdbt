import type BooleanQuery from '@/types/BooleanQuery';

const getQueryString = (address: string) => {
  const query: BooleanQuery = {
    bool: { must: [{ match: { street_name: address } }] },
  };

  const sort = [{ length: 'desc' }];

  return JSON.stringify({ query, sort });
};

export default getQueryString;

import BooleanQuery from '@/types/BooleanQuery';

const getQueryString = (address: string) => {
  const query: BooleanQuery = {
    bool: {
      must: [
        {
          match: { street_name: address }
        }
      ]
    }
  };

  const sort = [{ length:'desc' }];

  const queryString = JSON.stringify({
    query,
    sort
  });

  return queryString;
};

export default getQueryString;

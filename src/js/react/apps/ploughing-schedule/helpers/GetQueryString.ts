import BooleanQuery from '@/types/BooleanQuery';

const getQueryString = (keyword: string) => {
  const query: BooleanQuery = {
    bool: {
      must: [
        {
          match: { street_name: keyword }
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

const getSuggestionsQuery = (keyword: string) => {

  const query = {
    match_phrase_prefix: {
      street_name: {
        query: keyword
      }
    }
  };

  const fields = [
    'id',
    'street_name'
  ];

  const _source = 'false';

  const queryString = JSON.stringify({
    query,
    fields,
    _source
  });

  return queryString;
};

export default getSuggestionsQuery;

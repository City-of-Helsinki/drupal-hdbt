type TermQuery = {
  wildcard?: { [key: string]: { value: string; boost: number } };
  term?: { [key: string]: { value: string; boost?: number } };
};

type contentTypeQuery = {
  bool: {
    _name: string;
    should: TermQuery[];
    must?: TermQuery[];
    filter: { term: { _index: string } };
  };
};

type BooleanQuery = {
  function_score: {
    query: {
      bool: {
        should: contentTypeQuery[];
        filter: {
          term: { search_api_language: 'fi' | 'en' | 'sv' };
          terms: { content_type: string[] };
        }[];
      };
    };
    functions: [{ filter: { term: { content_type: string } }; weight: number }];
    score_mode: string;
    boost_mode: string;
    min_score: number;
  };
};

export default BooleanQuery;

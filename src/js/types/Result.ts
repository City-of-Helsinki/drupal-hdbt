interface Result<Type> {
  _index: string;
  _id: string;
  _score: string;
  _source: Type;
  inner_hits: {
    [key: string]: {
      hits: {
        total: {
          value: number;
          relation: string;
        };
        max_score: number;
        hits: Result<Type>[];
      };
    };
  };
}

export default Result;

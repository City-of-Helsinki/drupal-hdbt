interface Result<Type> {
  _index: string;
  _id: string;
  _score: string;
  _source: Type;
}

export default Result;

type BooleanQuery = {
  bool: {
    filter?: Array<any>
    must?: Array<any>,
    should?: Array<any>,
    minimum_should_match?: number
  }
}

export default BooleanQuery;

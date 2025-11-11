type SearchStateItemValue = { value: string };

type SearchStateItem = { value: SearchStateItemValue[] };

type SearchState = { [key: string]: SearchStateItem };

export default SearchState;

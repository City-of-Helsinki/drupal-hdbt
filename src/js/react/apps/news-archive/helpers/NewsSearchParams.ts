import URLParams from '../types/URLParams';

class NewsSearchParams extends URLSearchParams {
  constructor(paramString: string | null = null) {
    super();

    if (!paramString) {
      return;
    }

    // Decode the php-style parameters to native
    const params = new URLSearchParams(paramString);
    const entries = params.entries();
    let result = entries.next();
    const arrayValues: {[key:string]: string[]} = {};
    const arrayKeys = ['topic','neighbourhoods','groups'];

    while (!result.done) {
      const [key, value] = result.value;
      const matchedKey = arrayKeys.find((stateKey) => key.includes(stateKey));

      if (matchedKey) {
        arrayValues?.[matchedKey]?.length ? arrayValues[matchedKey].push(value) : arrayValues[matchedKey] = [value];
      }
      else {
        this.set(key, value);
      }

      result = entries.next();
    }

    Object.keys(arrayValues).forEach((key) => this.set(key, arrayValues[key].toString()));
  }

  toInitialValue(): URLParams {
    const initialParams: URLParams = {
      groups: [],
      neighbourhoods: [],
      topic: [],
    };

    const keys = Object.keys(initialParams);
    const entries = this.entries();
    let result = entries.next();
    while (!result.done) {
      const [key, value] = result.value;
      const matchedKey = keys.find((stateKey) => key.includes(stateKey));

      if (matchedKey) {
        const arrayValue = value.split(',');
        initialParams[matchedKey as keyof Omit<URLParams, 'page' | 'keyword'>] = arrayValue.map((id) => Number(id));
      }

      result = entries.next();
    }

    const initialPage = this.get('page');
    if (initialPage) {
      initialParams.page = Number(initialPage);
    }

    const initialKeyword = this.get('keyword');
    if (initialKeyword) {
      initialParams.keyword = initialKeyword;
    }

    return initialParams;
  }

  /**
   * Convert native search params to PHP style.
   *
   * @return {string} - The resulting string.
   */
  toString(): string {
    const resultingParams = new URLSearchParams();

    ['page', 'keyword'].forEach(key => {
      if (this.get(key)) {
        resultingParams.set(key, this.get(key) as string);
      }
    });

    ['topic', 'neighbourhoods', 'groups'].forEach(key => {
      const values = this.get(key)?.split(',') ?? [];

      values.forEach((id, index) => resultingParams.append(`${key}[${index}]`, id));
    });

    return resultingParams.toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
  }
}

export default NewsSearchParams;

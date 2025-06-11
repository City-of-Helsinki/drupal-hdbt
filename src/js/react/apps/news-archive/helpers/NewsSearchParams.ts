import SearchComponents from '../enum/SearchComponents';
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
        initialParams[matchedKey as keyof Omit<URLParams, 'page' | 'q'>] = arrayValue.map((id) => Number(id));
      }

      result = entries.next();
    }

    const initialPage = this.get('page');
    if (initialPage) {
      initialParams.page = Number(initialPage);
    }

    const initialKeyword = this.get('q');
    if (initialKeyword) {
      initialParams.q = initialKeyword;
    }

    return initialParams;
  }

  toString(): string {
    let allParamsString = '';
    const entries = this.entries();
    let result = entries.next();

    while (!result.done) {
      const [key, value] = result.value;
      let paramString = '';

      if (key === SearchComponents.RESULTS || key === SearchComponents.KEYWORD) {
        paramString = `${key}=${value}`;
      } else if (value && value.length) {

        if (value.includes(',')) {
          const valueArray = value.split(',');

          for (let i = 0; i < valueArray.length; i++) {
            if (paramString.length) {
              paramString += '&';
            }

            paramString += `${key}[${i}]=${valueArray[i].replaceAll(' ', '+').toLowerCase()}`;
          }
        }
        else {
          paramString += `${key}[0]=${value.toString()}`;
        }
      }

      allParamsString += allParamsString.length ? `&${paramString}` : paramString;
      result = entries.next();
    }

    if (allParamsString.length) {
      allParamsString = `?${  allParamsString}`;
    }

    return allParamsString;
  }
}

export default NewsSearchParams;

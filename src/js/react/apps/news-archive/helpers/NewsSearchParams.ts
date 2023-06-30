import SearchComponents from '../enum/SearchComponents';
import type InitialState from '../types/InitialState';

class NewsSearchParams extends URLSearchParams {
  private ALLOWED_KEYS = [
    SearchComponents.TOPIC,
    SearchComponents.NEIGHBOURHOODS,
    SearchComponents.NEWS_GROUPS,
    SearchComponents.RESULTS,
  ];

  constructor(paramString: string | null = null) {
    super();

    if (!paramString) {
      return;
    }

    const params = new URLSearchParams(paramString);
    const entries = params.entries();
    let result = entries.next();
    const initialParams: InitialState = {
      [SearchComponents.NEWS_GROUPS]: [],
      [SearchComponents.NEIGHBOURHOODS]: [],
      [SearchComponents.TOPIC]: [],
    };

    while (!result.done) {
      const [key, value] = result.value;
      const matchedKey = this.ALLOWED_KEYS.find((stateKey) => key.includes(stateKey));

      if (!matchedKey) {
        result = entries.next();
        continue;
      }

      if (matchedKey === SearchComponents.RESULTS) {
        this.set(SearchComponents.RESULTS, value);
      } else if (this.ALLOWED_KEYS.includes(matchedKey)) {
        initialParams[matchedKey as keyof Omit<InitialState, 'page'>]?.push(value);
      }

      result = entries.next();
    }

    Object.keys(initialParams).forEach((key: string) => {
      if (initialParams[key as keyof Omit<InitialState, 'page'>]?.length) {
        this.set(key, JSON.stringify(initialParams[key as keyof Omit<InitialState, 'page'>]));
      }
    });
  }

  toInitialValue(): InitialState {
    let initialParams: InitialState = {
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

      let parsedValue;

      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        parsedValue = value;
      }

      if (matchedKey) {
        initialParams[matchedKey as keyof Omit<InitialState, 'page'>] = parsedValue;
      }

      result = entries.next();
    }

    const initialPage = Number(this.get('page'));
    if (initialPage) {
      initialParams.page = Number(initialPage);
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

      if (key === SearchComponents.RESULTS) {
        paramString = `${key}=${value}`;
      } else if (value && value.length) {
        let parsedValue;

        try {
          parsedValue = JSON.parse(value);
        } catch (e) {
          parsedValue = value;
        }

        for (let i = 0; i < parsedValue.length; i++) {
          if (paramString.length) {
            paramString += '&';
          }

          paramString += `${key}[${i}]=${parsedValue[i].replaceAll(' ', '+').toLowerCase()}`;
        }
      }

      allParamsString += allParamsString.length ? '&' + paramString : paramString;
      result = entries.next();
    }

    if (allParamsString.length) {
      allParamsString = '?' + allParamsString;
    }

    return allParamsString;
  }
}

export default NewsSearchParams;

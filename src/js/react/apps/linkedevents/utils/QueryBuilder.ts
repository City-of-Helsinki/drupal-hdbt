import ApiKeys from '../enum/ApiKeys';

interface Options {
  [key: string]: string
}

export class QueryBuilder {
  baseUrl: string;

  originalParams: URLSearchParams;

  params: URLSearchParams;

  constructor(eventsApiUrl: string) {
    if (eventsApiUrl.indexOf('?') !== -1) {
      const [baseUrl, queryString] = eventsApiUrl.split('?');
      this.baseUrl = baseUrl;
      this.originalParams = new URLSearchParams(queryString);
      this.params = new URLSearchParams(queryString);
    } else {
      this.baseUrl = eventsApiUrl;
      this.originalParams = new URLSearchParams();
      this.params = new URLSearchParams();
    }
  }

  allEventsQuery() {
    return `${this.baseUrl}?${this.originalParams.toString()}`;
  }

  getUrl() {
    return `${this.baseUrl}?${this.params.toString()}`;
  }

  reset() {
    this.params = this.originalParams;
  }

  resetParam(option: string) {
    if (Object.values(ApiKeys).indexOf(option) !== -1) {
      const original = this.originalParams.get(option);
      original ? this.params.set(option, original) : this.params.delete(option);
    }
  }

  setParams(options: Options) {
    Object.keys(options).forEach((option: string) => {
      if (Object.values(ApiKeys).indexOf(option) !== -1) {
        this.params.set(option, options[option]);
      }
    });
  }
}

const init = (eventsApiUrl: string) => new QueryBuilder(eventsApiUrl);

export default init;

import ApiKeys from '../enum/ApiKeys';

interface Options {
 [key: string]: string
}

export class QueryBuilder {
  baseUrl: string;
  originalParams: URLSearchParams;
  params: URLSearchParams;

  constructor(eventsUrl: string) {
    if (eventsUrl.indexOf('?') !== -1) {
      const [baseUrl, queryString] = eventsUrl.split('?');
      this.baseUrl = baseUrl;
      this.originalParams = new URLSearchParams(queryString);
      this.params = new URLSearchParams(queryString);
    }
    else {
      this.baseUrl = eventsUrl;
      this.originalParams = new URLSearchParams();
      this.params = new URLSearchParams();
    }
  }

  allEventsQuery() {
    const params = this.originalParams;
    params.set('page_size', '-1');

    return `${this.baseUrl}?${params.toString()}`
  }
  
  getUrl() {
    return `${this.baseUrl}?${this.params.toString()}`
  }

  reset() {
    this.params = this.originalParams;
  }

  resetParam(option: string) {
    if(Object.values(ApiKeys).indexOf(option) !== -1) {
      const original = this.originalParams.get(option);
      original ? this.params.set(option, original) : this.params.delete(option);
    }
  }

  setParams(options: Options) {
    Object.keys(options).forEach((option: string) => {
      if(Object.values(ApiKeys).indexOf(option) !== -1) {
        this.params.set(option, options[option]);
      }
    })
  }
}

const init = (eventsUrl: string) => {
  return new QueryBuilder(eventsUrl);
}

export default init;

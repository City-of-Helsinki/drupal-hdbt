import ApiKeys from '../enum/ApiKeys';

interface Options {
  [key: string]: string
}

export class QueryBuilder {
  private baseUrl: string;

  private originalParams: URLSearchParams;

  private params: URLSearchParams;

  private currentUrl: string;

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

    this.currentUrl = eventsApiUrl;
  }

  public allEventsQuery() {
    return `${this.baseUrl}?${this.originalParams.toString()}`;
  }

  public updateUrl() {
    this.params.set('page', '1');
    this.currentUrl = `${this.baseUrl}?${this.params.toString()}`;
    return this.currentUrl;
  }

  public updatePageParam(page: number) {
    const currentUrl = new URL(this.currentUrl);
    currentUrl.searchParams.set('page', page.toString());
    this.currentUrl = currentUrl.toString();

    return this.currentUrl;
  }

  public getPage() {
    return this.params.get('page') || 1;
  }

  public getUrl() {
    return this.currentUrl;
  }

  public reset() {
    this.params = this.originalParams;
  }

  public resetParam(option: string) {
    if (Object.values(ApiKeys).indexOf(option) !== -1) {
      const original = this.originalParams.get(option);
      original ? this.params.set(option, original) : this.params.delete(option);
    }
  }

  public setParams(options: Options) {
    Object.keys(options).forEach((option: string) => {
      if (Object.values(ApiKeys).indexOf(option) !== -1) {
        this.params.set(option, options[option]);
      }
    });
  }
}

const init = (eventsApiUrl: string) => new QueryBuilder(eventsApiUrl);

export default init;

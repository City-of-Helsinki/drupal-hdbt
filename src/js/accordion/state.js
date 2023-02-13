export default class State {

  constructor() {
    this.site = window.drupalSettings.path.pathPrefix.match('/(.*?)/').shift().replaceAll('/', '');
    this.page = window.drupalSettings.path.currentPath;

    const siteAccordions = JSON.parse(localStorage.getItem(this.getStorageKey()));
    if (siteAccordions === null) {
      this.siteAccordionStates = {};
      this.siteAccordionStates[this.page] = {};
      this.pageAccordionStates = {};
    } else {
      this.siteAccordionStates = siteAccordions;
      this.pageAccordionStates = this.siteAccordionStates[this.page] === undefined ? {} : this.siteAccordionStates[this.page];
    }
  }

  getStorageKey = () => `${this.site}-accordion`;

  saveItemState = (accordionItemId, isOpen) => {
    this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadItemState = accordionItemId => {
    if (!this.siteAccordionStates) {
      return false;
    }
    return this.pageAccordionStates[accordionItemId] === undefined ? false : this.pageAccordionStates[accordionItemId];
  };

}

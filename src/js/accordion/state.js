export default class State {

  constructor() {
    if (window.drupalSettings.helfi_instance_name !== undefined) {
      this.site = window.drupalSettings.helfi_instance_name;
    }
    this.page = window.drupalSettings.path.currentPath;

    const siteAccordions = JSON.parse(localStorage.getItem(this.getStorageKey()));
    if (siteAccordions === null) {
      this.siteAccordionStates = {};
      this.siteAccordionStates[this.page] = {};
      this.pageAccordionStates = {};
    } else {
      this.siteAccordionStates = siteAccordions;
      this.siteAccordionStates[this.page] = this.siteAccordionStates[this.page] === undefined ? {} : this.siteAccordionStates[this.page];
      this.pageAccordionStates = this.siteAccordionStates[this.page];
    }
  }

  getStorageKey = () => `${this.site}-accordion`;

  saveItemState = (accordionItemId, isOpen) => {
    if (this.site === undefined) {
      return false;
    }
    this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadItemState = accordionItemId => {
    if (this.site === undefined) {
      return false;
    }
    return this.pageAccordionStates[accordionItemId] === undefined ? false : this.pageAccordionStates[accordionItemId];
  };

  static getCurrentLanguage = () => window.drupalSettings.path.currentLanguage;

}


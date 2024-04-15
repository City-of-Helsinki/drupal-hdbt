import LocalStorageManager from '../localStorageManager';

export default class State {

  constructor() {
    this.storageManager = new LocalStorageManager('helfi-settings');

    if (window.drupalSettings.helfi_instance_name !== undefined) {
      this.site = window.drupalSettings.helfi_instance_name;
    }
    this.page = window.drupalSettings.path.currentPath;
    const siteAccordions = JSON.parse(this.storageManager.getValues(this.getStorageKey()));
    if (siteAccordions === null) {
      this.siteAccordionStates = {};
      this.siteAccordionStates[this.page] = {};
      this.pageAccordionStates = {};
    } else {
      this.siteAccordionStates = siteAccordions;
      this.siteAccordionStates[this.page] = this.siteAccordionStates[this.page] === undefined ? {} : this.siteAccordionStates[this.page];
      this.pageAccordionStates = this.siteAccordionStates[this.page];
    }

    // Initialize the cookie check
    this.AccordionsOpen = State.isCookieSet('helfi_accordions_open');
  }

  static isCookieSet = cookieName => {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');

    // Loop through the cookies to see if desired one is set.
    for (let i = 0; i < cookieArray.length; i++) {
      const cookiePair = cookieArray[i].split('=');
      if (cookiePair[0] === cookieName) {
        return true;
      }
    }
    return false;
  };

  getStorageKey = () => `${this.site}-accordion`;

  saveItemState = (accordionItemId, isOpen) => {
    if (this.site === undefined) {
      return false;
    }
    this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    this.storageManager.addValue(this.getStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadItemState = accordionItemId => {
    // Use the cached cookie check result
    if (this.AccordionsOpen) {
      return true;
    }

    if (this.site === undefined) {
      return false;
    }
    return this.pageAccordionStates[accordionItemId] === undefined ? false : this.pageAccordionStates[accordionItemId];
  };

  static getCurrentLanguage = () => window.drupalSettings.path.currentLanguage;
}

import LocalStorageManager from '../localStorageManager';

export default class State {

  constructor() {
    this.storageManager = new LocalStorageManager('helfi-settings');

    this.site = window.drupalSettings.helfi_instance_name || '';
    this.page = window.drupalSettings.path.currentPath;
    this.siteAccordionStates = JSON.parse(this.storageManager.getValue(this.getStorageKey())) || {};
    this.pageAccordionStates = this.siteAccordionStates[this.page] || {};

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
    if (!this.site) return false;
    if (!this.siteAccordionStates[this.page]) this.siteAccordionStates[this.page] = {};
    this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    this.storageManager.setValue(this.getStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadItemState = accordionItemId => {
    if (!this.site) return false;
    return !!this.pageAccordionStates[accordionItemId];
  };

  static getCurrentLanguage = () => window.drupalSettings.path.currentLanguage;
}

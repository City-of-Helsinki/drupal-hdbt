import LocalStorageManager from '../localStorageManager';

export default class State {

  constructor() {
    this.storageManager = new LocalStorageManager('helfi-settings');

    this.site = window.drupalSettings.helfi_instance_name || '';
    this.page = window.drupalSettings.path.currentPath;
    this.siteAccordionStates = JSON.parse(this.storageManager.getValue(this.getStorageKey())) || {};
    this.pageAccordionStates = this.siteAccordionStates[this.page] || {};

    // Initialize the cookie check. This check is for Siteimprove so that it can
    // have all the accordions open always so that it can read the contents.
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
    // Save only the open accordion items to the local storage.
    if (isOpen === false) {
      delete this.siteAccordionStates[this.page][accordionItemId];
    } else {
      this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    }
    this.storageManager.setValue(this.getStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadItemState = accordionItemId => {
    // Use the cached cookie check result
    if (this.AccordionsOpen) {
      return true;
    }

    if (!this.site) return false;
    return !!this.pageAccordionStates[accordionItemId];
  };

  static getCurrentLanguage = () => window.drupalSettings.path.currentLanguage;
}

import ClientHelpers from '../clientHelpers';
import LocalStorageManager from '../localStorageManager';

export default class AccordionState {
  constructor() {
    this.storageManager = new LocalStorageManager('helfi-settings');
    this.site = window.drupalSettings.helfi_instance_name || '';
    this.page = window.drupalSettings.path.currentPath;
    this.siteAccordionStates = JSON.parse(this.storageManager.getValue(this.getAccordionStorageKey())) || {};
    this.pageAccordionStates = this.siteAccordionStates[this.page] || {};

    // Initialize the cookie check. This check is for Siteimprove so that it can
    // have all the accordions open always so that it can read the contents.
    this.AccordionsOpen = ClientHelpers.isCookieSet('helfi_accordions_open');
  }

  getAccordionStorageKey = () => `${this.site}-accordion`;

  saveAccordionItemState = (accordionItemId, isOpen) => {
    if (!this.site) return false;
    if (!this.siteAccordionStates[this.page]) this.siteAccordionStates[this.page] = {};
    // Save only the open accordion items to the local storage.
    if (isOpen === false) {
      delete this.siteAccordionStates[this.page][accordionItemId];
    } else {
      this.siteAccordionStates[this.page][accordionItemId] = isOpen;
    }
    this.storageManager.setValue(this.getAccordionStorageKey(), JSON.stringify(this.siteAccordionStates));
  };

  loadAccordionItemState = (accordionItemId) => {
    // Use the cached cookie check result
    if (this.AccordionsOpen) return true;
    if (!this.site) return false;
    return !!this.pageAccordionStates[accordionItemId];
  };
}

/**
 * General purpose local storage manager.
 * Use this class if you need to update for example helfi-settings.
 */
export default class LocalStorageManager {

  saveEventKey = 'localstorage-save-event';

  constructor(storageKey) {
    this.data = {};
    this.storageKey = storageKey;
    this.loadData();

    // eslint-disable-next-line
    addEventListener(this.saveEventKey, this.loadOnChange);
  }

  /**
   * Callback to prevent overriding data when a page has multiple instances of this object.
   */
  loadOnChange = () => {
    this.loadData();
  };

  /**
   * Trigger custom save event, prevent other instances from overriding data.
   */
  triggerSaveEvent = () => {
    dispatchEvent(new CustomEvent(this.saveEventKey));
  };

  loadData = () => {
    let data = null;

    try {
      data = localStorage.getItem(this.storageKey);
    }
    catch(error) {
      LocalStorageManager.handleError(error);
    }

    this.data = data ? JSON.parse(data) : {};
  };

  saveData = () => {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      this.triggerSaveEvent();
    }
    catch(error) {
      LocalStorageManager.handleError(error);
    }
  };

  setValue = (key, value) => {
    // Directly set the value, assumes handling of objects
    this.data[key] = value;
    this.saveData();
  };

  addValue = (key, value) => {
    if (!this.data[key]) {
      this.data[key] = [];
    }
    // Ensure that the value isn't an array and that it's not already included
    if (typeof value === 'string' && !this.data[key].includes(value)) {
      this.data[key].push(value);
      this.saveData();
    }
  };

  getValue = (key) => this.data[key] || null;

  getValues = (key) => this.data[key] || null;

  removeValue = (key, value) => {
    if (this.data[key]) {
      const index = this.data[key].indexOf(value);
      if (index > -1) {
        this.data[key].splice(index, 1);
        this.saveData();
      }
    }
  };

  static handleError(error) {
    if (error instanceof ReferenceError) {
      // Prevent security error caused by incognito-mode.
    }
    else {
      throw error;
    }
  }

}

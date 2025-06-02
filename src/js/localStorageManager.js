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
  triggerSaveEvent = () => dispatchEvent(new CustomEvent(this.saveEventKey));

  /**
   * Load data from localstorage by storage key.
   */
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

  /**
   * Save data to localstorage.
   */
  saveData = () => {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      this.triggerSaveEvent();
    }
    catch(error) {
      LocalStorageManager.handleError(error);
    }
  };

  /**
   * Update an existing value from localstorage.
   */
  setValue = (key, value) => {
    // Directly set the value, assumes handling of objects
    this.data[key] = value;
    this.saveData();
  };

  /**
   * Add a new value to localstorage.
   */
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

  /**
   * Get a single value from localstorage
   */
  getValue = (key) => this.data[key] || null;

  /**
   * Get a single value from localstorage
   */
  getValues = (key) => this.data[key] || null;

  /**
   * Remove an existing value from localstorage.
   */
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

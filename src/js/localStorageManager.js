/**
 * General purpose local storage manager.
 * Use this class if you need to update for example helfi-settings.
 */
export default class LocalStorageManager {

  saveEventKey = 'localstorage-save-event';

  /**
   * @param {string} storageKey - The key used to store data in localStorage.
   */
  constructor(storageKey) {
    this.data = {};
    this.storageKey = storageKey;
    this.loadData();

    // eslint-disable-next-line
    addEventListener(this.saveEventKey, this.loadOnChange);
  }

  /**
   * Callback to prevent overwriting data when a page has multiple
   * instances of this object.
   *
   * @return {void}
   */
  loadOnChange = () => {
    this.loadData();
  };

  /**
   * Trigger custom save event to notify other instances.
   *
   * @return {void}
   */
  triggerSaveEvent = () => {
    dispatchEvent(new CustomEvent(this.saveEventKey));
  };

  /**
   * Load data from localStorage.
   *
   * @return {void}
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
   * Save data to localStorage.
   *
   * @return {void}
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
   * Set a value in localStorage data.
   *
   * @param {string} key - The key to set.
   * @param {*} value - The value to store.
   * @return {void}
   */
  setValue = (key, value) => {
    // Directly set the value, assumes handling of objects
    this.data[key] = value;
    this.saveData();
  };

  /**
   * Add a string value to an array under the given key.
   *
   * @param {string} key - The key for the array.
   * @param {string} value - The value to add.
   * @return {void}
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
   * Get a value by key.
   *
   * @param {string} key - The key to retrieve.
   * @return {*} The stored value or null.
   */
  getValue = (key) => this.data[key] || null;

  /**
   * Get a list of values by key.
   *
   * @param {string} key - The key to retrieve.
   * @return {Array|null} The array of values or null.
   */
  getValues = (key) => this.data[key] || null;

  /**
   * Remove a value from an array under the given key.
   *
   * @param {string} key - The key for the array.
   * @param {string} value - The value to remove.
   * @return {void}
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

  /**
   * Handle an error thrown by localStorage.
   *
   * @param {Error} error - The error to handle.
   * @return {void}
   */
  static handleError(error) {
    if (error instanceof ReferenceError) {
      // Prevent security error caused by incognito-mode.
    }
    else {
      throw error;
    }
  }
}

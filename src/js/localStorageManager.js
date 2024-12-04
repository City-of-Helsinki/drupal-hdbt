/**
 * General purpose local storage manager.
 * Use this class if you need to update for example helfi-settings.
 */
export default class LocalStorageManager {
  constructor(storageKey) {
    this.data = {};
    this.storageKey = storageKey;
    this.loadData();
  }

  loadData() {
    let data = null;

    try {
      data = localStorage.getItem(this.storageKey);
    }
    catch(error) {
      LocalStorageManager.handleError(error);
    }

    this.data = data ? JSON.parse(data) : {};
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }
    catch(error) {
      LocalStorageManager.handleError(error);
    }
  }

  setValue(key, value) {
    // Directly set the value, assumes handling of objects
    this.data[key] = value;
    this.saveData();
  }

  getValue(key) {
    // Returns the value which could be an object
    return this.data[key] || null;
  }

  addValue(key, value) {
    if (!this.data[key]) {
      this.data[key] = [];
    }
    // Ensure that the value isn't an array and that it's not already included
    if (typeof value === 'string' && !this.data[key].includes(value)) {
      this.data[key].push(value);
      this.saveData();
    }
  }

  getValues(key) {
    return this.data[key] || null;
  }

  removeValue(key, value) {
    if (this.data[key]) {
      const index = this.data[key].indexOf(value);
      if (index > -1) {
        this.data[key].splice(index, 1);
        this.saveData();
      }
    }
  }

  static handleError(error) {
    if (error instanceof ReferenceError) {
      // Prevent security error caused by incognito-mode.
    }
    else {
      throw error;
    }
  }

}

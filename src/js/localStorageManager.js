/**
 * General purpose local storage manager.
 * Use this class if you need to update for example helfi-settings.
 */
export default class LocalStorageManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.loadData();
  }

  loadData() {
    const data = localStorage.getItem(this.storageKey);
    this.data = data ? JSON.parse(data) : {};
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
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
}

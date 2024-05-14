/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import {
  parse,
} from 'cookie/index';

import deleteCookie from './deleteCookie';

class MonitorAncCleanBrowserStorages {

  // MARK: Private properties

  #MONITOR_INTERVAL;

  #REMOVE;

  #cookie_name = 'city-of-helsinki-cookie-consents'; // Overridable default value

  // Initial keys found when script is initialized
  #INITIAL_STORED_KEYS = {
    cookie: [],
    localStorage: [],
    sessionStorage: [],
    indexedDB: [],
    cacheStorage: [],
  };

  // Keys already reported via event
  #reportedKeys = {
    cookie: [],
    localStorage: [],
    sessionStorage: [],
    indexedDB: [],
    cacheStorage: [],
  };

  // If key removal was not successfull, add it to this list to prevent multiple tries
  #removalFailedKeys = {
    cookie: [],
    localStorage: [],
    sessionStorage: [],
    indexedDB: [],
    cacheStorage: [],
  };

  // MARK: Public methods
  /**
   * Constructs a new instance of the MonitorAndCleanBrowserStorages class.
   * @param {number} [monitorInterval=500] - The interval in milliseconds at which to monitor the stored keys.
   * @param {boolean} [remove=false] - Indicates whether to remove the stored keys or not.
   */
  constructor(
    monitorInterval = 500,
    remove = false,
  ) {
    this.#MONITOR_INTERVAL = monitorInterval;
    this.#REMOVE = remove;
    this.#INITIAL_STORED_KEYS = {
      cookie: this.#getCookieNamesArray(),
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      indexedDB: this.#getIndexedDBNamesArray(),
      cacheStorage: this.#getCacheStorageNamesString(),
    };
  }


  async getStatus() {
    const status = {
      initial: this.#INITIAL_STORED_KEYS,
      current: {
        cookie: this.#getCookieNamesArray(),
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
        indexedDB: await this.#getIndexedDBNamesArray(),
        cacheStorage: await this.#getCacheStorageNamesString(),
      },
      reported: this.#reportedKeys,
      removalFailed: this.#removalFailedKeys,
    };

    return status;
  }

  // MARK: Private methods

  /**
   * Returns a string containing the names of all cookies.
   * @private
   * @return {array} An array containing the names of all cookies.
   */
  #getCookieNamesArray() {
    const cookies = document.cookie.split(';');
    const cookieNames = cookies.map(cookie => cookie.split('=')[0].trim());
    return cookieNames;
  }


  /**
   * Retrieves and parses the cookie consent cookie.
   * @private
   * @param {string} [cookieName] - The name of the cookie to be parsed.
   * @return {Object|boolean} The parsed cookie object, or false if the cookie is not set or parsing is unsuccessful.
   */
  #getCookie(cookieName) {
    try {
      if (!cookieName) {
        // `this` is not set, and cookieName is not provided
        return false;
      }
      const cookieString = parse(document.cookie)[cookieName];
      if (!cookieString) {
        return false;
      }
      return JSON.parse(cookieString);
    } catch (err) {
      console.error(`Cookie parsing unsuccessful:\n${err}`);
      return false;
    }
  }


  /**
   * Retrieves the names of all indexedDB databases as a string.
   * @private
   * @return {Promise<array>} A promise that resolves to an array containing the names of all indexedDB databases. If there are no indexedDB databases, an empty array is returned.
   */
  async #getIndexedDBNamesArray() {
    if (indexedDB && indexedDB.databases) {
      const databases = await indexedDB.databases();
      const databaseNames = databases.map(db => db.name);
      return databaseNames;
    }
    return [];
  }

  /**
   * Retrieves the names of all cache storages as a string.
   * @private
   * @return {Promise<array>} A promise that resolves to an array containing the names of all cache storages. If there are no cache storages, an empty array is returned.
   */
  async #getCacheStorageNamesString() {
    if (caches) {
      const cacheNames = await caches.keys();
      return cacheNames;
    }
    return [];
  }

  /**
   * Checks if a given key is consented based on the provided consented keys with wildcards.
   *
   * @param {string} key - The key to check consent for.
   * @param {Array<string>} consentedKeys - The array of consented keys.
   * @return {boolean} - Returns true if the key is consented, false otherwise.
   */
  #isKeyConsented(key, consentedKeys) {
    // If no keys are consented, return false
    if (!Array.isArray(consentedKeys) || consentedKeys.length === 0) {
      return false;
    }
    // Check if the key is directly consented
    if (consentedKeys.includes(key)) {
      return true;
    }

    // Check if the key matches a wildcard pattern in consentedKeys that have * in them
    const consentedKeysWithWildcard = consentedKeys.filter(consentedKey => consentedKey.includes('*'));
    const consentedKeysRegexp = consentedKeysWithWildcard.map(consentedKey => new RegExp(`^${consentedKey.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`));

    // Check if the key matches any of the wildcard patterns
    return consentedKeysRegexp.some(regexp => regexp.test(key));
  }

  /**
   * Monitors the consented keys and reports any unapproved keys. (cookies or localStorage or sessionStorage)
   * Reports found unapproved keys to console and dispatches an event based on type.
   * @private
   * @param {string} typeString - The type of keys being monitored.
   * @param {string[]} consentedKeysArray - An array of consented keys.
   * @param {string[]} initialStoredKeysArray - The initial stored keys.
   * @param {string[]} reportedKeysArray - An array of reported keys.
   * @param {string[]} currentStoredKeysArray - An array of current stored keys.
   * @param {string} consentedGroups - The consented groups.
   */
  #monitor(
    typeString,
    consentedKeysArray,
    initialStoredKeysArray,
    reportedKeysArray,
    currentStoredKeysArray,
    consentedGroups,
  ) {
    if (currentStoredKeysArray.join(';') !== initialStoredKeysArray.join(';')) {

      // Find items that appear only in currentStoredKeysArray and filter out the ones that are already in consentedKeysArray
      const unapprovedKeys = currentStoredKeysArray.filter((key) => {
        if (
          key === '' || // If the key is empty, filter it out
          initialStoredKeysArray.includes(key) || // If key is not new, filter it out
          reportedKeysArray.includes(key) || // If key is already reported, filter it out
          this.#isKeyConsented(key, consentedKeysArray) // If key is consented (with possible wildcards), filter it out
        ) {
          return false;
        }
        return true;
      });

      if (unapprovedKeys.length > 0) {
        console.log(`Cookie consent found unapproved ${typeString}(s): '${unapprovedKeys.join('\', \'')}'`);

        const event = new CustomEvent('hds-cookie-consent-unapproved-item-found', {
          detail: {
            type: typeString,
            keys: unapprovedKeys,
            consentedGroups
          }
        });
        window.dispatchEvent(event);

        reportedKeysArray.push(...unapprovedKeys);
      }
    }

    if (this.#REMOVE) {
      const deleteKeys = currentStoredKeysArray.filter((key) => {
        if (
          key === '' || // If the key is empty, filter it out
          this.#isKeyConsented(key, consentedKeysArray) // If key is consented (with possible wildcards), filter it out
        ) {
          return false;
        }
        return true;
      });

      if(deleteKeys.length > 0) {
        // console.log('deleteKeys', deleteKeys, deleteKeys.length);
        deleteKeys.forEach(key => {
          // console.log('typeString', typeString, this.#removalFailedKeys, this.#removalFailedKeys[typeString]);
          if (!this.#removalFailedKeys[typeString].includes(key)) {
            console.log(`Cookie consent will delete unapproved ${typeString}(s): '${deleteKeys.join('\', \'')}'`);

            if (typeString === 'cookie') {
              deleteCookie(key);
              if (this.#getCookie(key)) {
                console.error(`Error deleting cookie '${key}' will ignore it for now`);
                this.#removalFailedKeys.cookie.push(key);
              }
            } else if (typeString === 'localStorage') {
              localStorage.removeItem(key);
            } else if (typeString === 'sessionStorage') {
              sessionStorage.removeItem(key);
            } else if (typeString === 'indexedDB') {
              const request = indexedDB.deleteDatabase(key);
              request.onsuccess = () => {
                // console.log(`IndexedDB database '${key}' deleted successfully.`);
                // Remove the key from the blacklist as the deletion was successful
                this.#removalFailedKeys.indexedDB = this.#removalFailedKeys.indexedDB.filter(item => item !== key);
              };
              request.onerror = () => {
                // console.error(`Error deleting IndexedDB database '${key}'`);
                this.#removalFailedKeys.indexedDB.push(key);
              };
              request.onblocked = () => {
                // console.warn(`IndexedDB database '${key}' deletion blocked.`);
                this.#removalFailedKeys.indexedDB.push(key);
              };
            } else if (typeString === 'cacheStorage') {
              caches.delete(key).then((response) => {
                if(response) {
                  console.log(`Cache '${key}' has been deleted`);
                } else {
                  console.log(`Cache '${key}' not found`);
                }
              });
            }
          }
        });
      }
      }

  }

  /**
   * Monitors cookies, local storage, and session storage for unconsented new keys.
   * @private
   */
  async #monitorLoop() {
    // console.log('monitoring', JSON.stringify(this.#reportedKeys));

    const consentCookie = this.#getCookie(this.#cookie_name);
    let acceptedGroups = '';
    if (consentCookie && consentCookie.groups) {
      acceptedGroups = Object.keys(consentCookie.groups).join(';');
    }

    const consentedCookies = consentCookie?.cookies?.split(';') || [];
    consentedCookies.push(this.#cookie_name);
    this.#monitor(
      'cookie',
      consentedCookies,
      this.#INITIAL_STORED_KEYS.cookie,
      this.#reportedKeys.cookie,
      this.#getCookieNamesArray(),
      acceptedGroups,
    );

    const consentedLocalStorage = consentCookie?.localStorage || [];
    this.#monitor(
      'localStorage',
      consentedLocalStorage,
      this.#INITIAL_STORED_KEYS.localStorage,
      this.#reportedKeys.localStorage,
      Object.keys(localStorage),
      acceptedGroups,
    );

    const consentedSessionStorage = consentCookie?.sessionStorage || [];
    this.#monitor(
      'sessionStorage',
      consentedSessionStorage,
      this.#INITIAL_STORED_KEYS.sessionStorage,
      this.#reportedKeys.sessionStorage,
      Object.keys(sessionStorage),
      acceptedGroups,
    );

    if (indexedDB) {
      const consentedIndexedDB = consentCookie?.indexedDB || [];
      this.#monitor(
        'indexedDB',
        consentedIndexedDB,
        (await this.#INITIAL_STORED_KEYS.indexedDB),
        this.#reportedKeys.indexedDB,
        (await this.#getIndexedDBNamesArray()),
        acceptedGroups,
      );
    }

    if (caches) {
      const consentedCacheStorage = consentCookie?.cacheStorage || [];
      this.#monitor(
        'cacheStorage',
        consentedCacheStorage,
        (await this.#INITIAL_STORED_KEYS.cacheStorage),
        this.#reportedKeys.cacheStorage,
        (await this.#getCacheStorageNamesString()),
        acceptedGroups,
      );
    }
  }

  /**
   * Monitors cookies and storage at a specified interval.
   * @private
   */
  #monitorCookiesAndStorage() {
    const interval = Math.max(this.#MONITOR_INTERVAL, 50);

    this.#monitorLoop();
    setInterval(() => { this.#monitorLoop(); }, interval);
  }


  init(cookieName) {
    this.#cookie_name = cookieName;

    if (this.#MONITOR_INTERVAL > 0) {
      this.#monitorCookiesAndStorage();
    }
  }
}

export default MonitorAncCleanBrowserStorages;

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import {
  parse,
  serialize,
} from 'cookie/index';

import {
  getCookieBannerHtml,
  getGroupHtml,
  getTableRowHtml,
} from './template';

import {
  getTranslation,
  getTranslationKeys,
} from './hds-cc_translations';

import deleteCookie from './deleteCookie';

/**
 * Represents a class for managing cookie consent.
 * @class
 */
class HdsCookieConsentClass {
  // MARK: Private properties
  #SITE_SETTINGS_JSON_URL;

  #LANGUAGE;

  #TARGET_SELECTOR;

  #SPACER_PARENT_SELECTOR;

  #PAGE_CONTENT_SELECTOR;

  #SUBMIT_EVENT = false;

  #SETTINGS_PAGE_SELECTOR;

  #MONITOR_INTERVAL;

  #REMOVE;

  #TEMP_CSS_PATH;

  #COOKIE_DAYS = 100;

  #UNCHANGED = 'unchanged';

  #ESSENTIAL_GROUP_NAME = 'essential';

  #shadowRoot = null;

  #bannerElements = {
    bannerContainer: null,
    spacer: null,
  };

  #settingsPageElement = null;

  #resizeReference = {
    resizeObserver: null,
    bannerHeightElement: null,
  };

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
   * Creates a new instance of the CookieConsent class.
   * @constructor
   * @param {Object} options - The options for configuring the CookieConsent instance.
   * @param {string} options.siteSettingsJsonUrl - The path to the JSON file with site settings.
   * @param {string} [options.language='en'] - The page language.
   * @param {string} [options.targetSelector='body'] - The selector for where to inject the banner.
   * @param {string} [options.spacerParentSelector='body'] - The selector for where to inject the spacer.
   * @param {string} [options.pageContentSelector='body'] - The selector for where to add scroll-margin-bottom.
   * @param {boolean|string} [options.submitEvent=false] - If a string, do not reload the page, but submit the string as an event after consent.
   * @param {string} [options.settingsPageSelector=null] - If this string is set and a matching element is found on the page, show cookie settings in a page replacing the matched element.
   * @param {number} [options.monitorInterval=500] - Monitors cookies that JS can see (same domain, not hidden from js) for misconfiguration. Defaults to 500ms, set to 0 to disable.
   * @param {boolean} [options.remove=false] - If true, deletes any unapproved cookies and other stored items. Defaults to false.
   * @param {string} [options.tempCssPath='/path/to/external.css'] - The temporary path to the external CSS file.
   * @throws {Error} Throws an error if siteSettingsJsonUrl is not provided.
   */
  constructor(
    {
      siteSettingsJsonUrl, // Path to JSON file with site settings
      language = 'en', // Page language
      targetSelector = 'body', // Where to inject the banner
      spacerParentSelector = 'body', // Where to inject the spacer
      pageContentSelector = 'body', // Where to add scroll-margin-bottom
      submitEvent = false, // if string, do not reload page, but submit the string as event after consent
      settingsPageSelector = null, // If this string is set and a matching element is found on the page, show cookie settings in a page replacing the matched element.
      monitorInterval = 500, // Monitors cookies that JS can see (same domain, not hidden from js) for misconfiguration. Defaults to 500ms, set to 0 to disable, minimum 50ms.
      remove = false, // If true, deletes any unaproved cookies and other stored items
      tempCssPath = '/path/to/external.css', // TODO: Remove this tempoarry path to external CSS file
    }
  ) {
    if (!siteSettingsJsonUrl) {
      throw new Error('Cookie consent: siteSettingsJsonUrl is required');
    }
    this.#SITE_SETTINGS_JSON_URL = siteSettingsJsonUrl;
    this.#LANGUAGE = language;
    this.#TARGET_SELECTOR = targetSelector;
    this.#SPACER_PARENT_SELECTOR = spacerParentSelector;
    this.#PAGE_CONTENT_SELECTOR = pageContentSelector;
    this.#SUBMIT_EVENT = submitEvent;
    this.#SETTINGS_PAGE_SELECTOR = settingsPageSelector;
    this.#MONITOR_INTERVAL = monitorInterval;
    this.#REMOVE = remove;
    this.#TEMP_CSS_PATH = tempCssPath;

    this.#INITIAL_STORED_KEYS = {
      cookie: this.#getCookieNamesArray(),
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      indexedDB: this.#getIndexedDBNamesArray(),
      cacheStorage: this.#getCacheStorageNamesString(),
    };

    window.hds = window.hds || {};
    window.hds.cookieConsent = this;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.#init();
      });
    } else {
      this.#init();
    }
  }

  /**
   * Get the consent status for the specified cookie group names.
   * @param {string[]} groupNamesArray - An array of group names.
   * @return {Promise<boolean>} A promise that resolves to true if all the groups are accepted, otherwise false.
   */
  getConsentStatus(groupNamesArray) {

    // Check if group names are provided as an array and not empty
    if (!Array.isArray(groupNamesArray) || groupNamesArray.length === 0) {
      console.error('Cookie consent: Group names must be provided as an non-empty array.');
      return false;
    }

    const browserCookieState = this.#getCookie();

    // Check if our cookie exists and has groups set
    if (!browserCookieState || !browserCookieState.groups) {
      // console.log('Cookie is not set properly', browserCookieState, browserCookieState.groups);
      return false;
    }

    // Check if all groups are in accepted groups
    return groupNamesArray.every(groupName => !!browserCookieState.groups[groupName]);
  }

  /**
   * Sets the status of given cookie groups to accepted.
   *
   * @param {Array} acceptedGroupsArray - An array of cookie group names to be set as accepted.
   * @return {Promise<boolean>} - A promise that resolves to true if the groups' status is successfully set to accepted, otherwise false.
   */
  async setGroupsStatusToAccepted(acceptedGroupsArray) {
    const browserCookie = this.#getCookie();
    // If cookie is not set, or it has a showBanner set to true, we need to set the banner to be shown
    const showBanner = !browserCookie || browserCookie.showBanner || false;

    // If cookie is set, get the accepted groups
    let currentlyAccepted = [];
    if (browserCookie) {
      currentlyAccepted = Object.keys(browserCookie.groups);
    }

    // Try to fetch the site settings from the JSON file
    let siteSettings = null;
    try {
      siteSettings = await this.#getSiteSettingsFromJsonFile();
    } catch (err) {
      console.error(`Cookie consent: Unable to fetch cookie consent settings: ${err}`);
      return false;
    }

    const siteSettingsGroups = [...siteSettings.requiredCookies.groups, ...siteSettings.optionalCookies.groups];

    // Checksums for all groups calculated in parallel without waiting for each
    await Promise.all(siteSettingsGroups.map(async (group) => {
      group.checksum = await this.#getChecksum(group);
    }));

    // Save accepted groups and update checkbox state
    this.#saveAcceptedGroups(siteSettings, [...currentlyAccepted, ...acceptedGroupsArray], showBanner);
    return true;
  }

  // MARK: Private methods

  /**
   * Get checksum from string
   * @private
   * @param {string} message - The string to be hashed.
   * @param {number} [length=8] - The length of the hash (default is 8).
   * @return {string} - The hash in base16 from the string.
   *
   * Reference: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
   */
  async #getChecksum(message, length = 8) {
    let messageString = message;
    if (typeof message !== 'string') {
      messageString = JSON.stringify(message);
    }
    const msgUint8 = new TextEncoder().encode(messageString);                     // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);             // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    // Return only length number of hash
    return hashHex.substring(0, length);
  }


  /**
   * Retrieves and parses the cookie consent cookie.
   * @private
   * @param {string} [cookieName] - The name of the cookie to be parsed.
   * @return {Object|boolean} The parsed cookie object, or false if the cookie is not set or parsing is unsuccessful.
   */
  #getCookie(cookieName = undefined) {
    try {
      if (this && this.#cookie_name && !cookieName) {
        cookieName = this.#cookie_name;
      } else if (!cookieName) {
        // `this` is not set, and cookieName is not provided
        return false;
      }
      const cookieString = parse(document.cookie)[cookieName];
      if (!cookieString) {
        // console.error('Cookie is not set');
        return false;
      }
      return JSON.parse(cookieString);
    } catch (err) {
      console.error(`Cookie parsing unsuccessful:\n${err}`);
      return false;
    }
  }



  /**
   * Removes the banner and related elements.
   * @private
   * @function #removeBanner
   */
  #removeBanner() {
    // Remove banner size observer
    if (this.#resizeReference.resizeObserver && this.#resizeReference.bannerHeightElement) {
      this.#resizeReference.resizeObserver.unobserve(this.#resizeReference.bannerHeightElement);
    }
    // Remove banner elements
    if (this.#bannerElements.bannerContainer) {
      this.#bannerElements.bannerContainer.remove();
    }
    if (this.#bannerElements.spacer) {
      this.#bannerElements.spacer.remove();
    }
    // Remove scroll-margin-bottom variable from all elements inside the contentSelector
    document.documentElement.style.removeProperty('--hds-cookie-consent-height');
  }


  /**
   * Sets a cookie with the provided data.
   * @private
   * @param {Object} cookieData - The data to be stored in the cookie.
   */
  #setCookie(cookieData) {
    // console.log('#setCookie', cookieData);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.#COOKIE_DAYS);
    document.cookie = serialize(
      this.#cookie_name,
      JSON.stringify(cookieData),
      {
        sameSite: 'strict',
        expires: expiryDate,
        path: '/',
      });
  }

  /**
   * Retrieves the keys in accepted groups based on the provided parameters.
   * @private
   * @param {Object} siteSettings - The site settings object.
   * @param {Array} acceptedGroupNames - An array of accepted group names.
   * @param {string} type - The type of cookies to filter.
   * @return {Array} - An array of accepted cookie keys.
   */
  #getCookieKeysInAcceptedGroups(siteSettings, acceptedGroupNames, type) {
    const acceptedCookies = new Set();

    // Add relevant robotCookies to accepted cookies
    siteSettings.robotCookies?.forEach(cookie => {
      if (cookie.type === type) {
        acceptedCookies.add(cookie.name);
      }
    });

    const allGroups = [...siteSettings.requiredCookies.groups, ...siteSettings.optionalCookies.groups];
    allGroups.forEach(group => {
      if (acceptedGroupNames.includes(group.groupId)) {
        group.cookies.forEach(cookie => {
          if (cookie.type === type) {
            acceptedCookies.add(cookie.name);
          }
        });
      }
    });
    return Array.from(acceptedCookies);
  }

  /**
   * Saves the accepted cookie groups to cookie, unsets others.
   * @private
   * @param {Object} siteSettings - Site specific settings
   * @param {Array} acceptedGroupNames - The names of the accepted cookie groups.
   * @param {boolean} showBanner - Whether to show the banner or not.
   */
  #saveAcceptedGroups(siteSettings, acceptedGroupNames = [], showBanner = false) {
    // console.log('Saving accepted cookie groups:', acceptedGroupNames, showBanner);

    const acceptedGroups = {};

    // Find group checksums for accepted groups
    const allGroups = [...siteSettings.requiredCookies.groups, ...siteSettings.optionalCookies.groups];
    allGroups.forEach(group => {
      if (acceptedGroupNames.includes(group.groupId)) {
        acceptedGroups[group.groupId] = group.checksum;
      }
    });

    const cookiesKeys = this.#getCookieKeysInAcceptedGroups(siteSettings, acceptedGroupNames, 1).join(';');
    const localStorageKeys = this.#getCookieKeysInAcceptedGroups(siteSettings, acceptedGroupNames, 2).join(';');
    const sessionStorageKeys = this.#getCookieKeysInAcceptedGroups(siteSettings, acceptedGroupNames, 3).join(';');

    const data = {
      checksum: siteSettings.checksum,
      groups: acceptedGroups,
      ...(showBanner && { showBanner: true }), // Only add showBanner if it's true
      ...(cookiesKeys && { cookies: cookiesKeys }), // Only add cookies if keys are present
      ...(localStorageKeys && { localStorage: localStorageKeys }), // Only add localStorage if keys are present
      ...(sessionStorageKeys && { sessionStorage: sessionStorageKeys }), // Only add sessionStorage if keys are present
    };

    this.#setCookie(data);

    // Update the checkboxes to reflect the new state (if called outside)
    if (this.#shadowRoot) {
      const form = this.#shadowRoot.querySelector('form');
      if (form) {
        const formCheckboxes = form.querySelectorAll('input');

        formCheckboxes.forEach(check => {
          check.checked = acceptedGroupNames.includes(check.dataset.group);
        });
      }
    }
  }

  /**
   * Removes invalid groups from the cookie based on the browser cookie state and site settings.
   *
   * @private
   * @param {Array} siteSettingsGroups - Required and optional cookie groups combined array from site settings.
   * @param {Object} browserCookieState - The browser cookie state object.
   * @param {Object} siteSettings - The site settings object.
   * @return {Object} - The updated site settings object.
   */
  async #removeInvalidGroupsFromCookie(siteSettingsGroups, browserCookieState, siteSettings) {
    // console.log('#removeInvalidGroupsFromCookie', siteSettingsGroups, browserCookieState, siteSettings);
    let invalidGroupsFound = false;
    const newCookieGroups = [];

    // Loop through all groups in site settings and store each groups name and checksum
    const siteSettingsGroupsChecksums = {};
    siteSettingsGroups.forEach(group => {
      siteSettingsGroupsChecksums[group.groupId] = group.checksum;
    });

    // Loop through browser cookie groups and check if they are in site settings, store valid groups to be saved
    if (browserCookieState.groups) {
      Object.keys(browserCookieState.groups).forEach(groupName => {
        const group = browserCookieState.groups[groupName];
        if (siteSettingsGroupsChecksums[groupName] && siteSettingsGroupsChecksums[groupName] === group) {
          newCookieGroups.push(group.groupId);
        } else {
          invalidGroupsFound = true;
          console.log(`Invalid group found in browser cookie: '${group.groupId}', removing from cookie.`);
        }
      });
    }

    if (invalidGroupsFound) {
      const showBanner = true;
      this.#saveAcceptedGroups(siteSettings, newCookieGroups, showBanner);
    }

    return siteSettings;
  }

  /**
   * Fetches the site settings from a JSON file and returns them as an object.
   * @private
   * @return {Promise<Object>} A promise that resolves to the site settings object.
   * @throws {Error} If there is an error fetching the cookie consent settings or parsing the JSON.
   */
  async #getSiteSettingsFromJsonFile() {
    // Fetch the site settings JSON file
    let siteSettingsRaw;
    try {
      siteSettingsRaw = await fetch(this.#SITE_SETTINGS_JSON_URL).then((response) => response.text());
    } catch (error) {
      throw new Error(`Cookie consent: Unable to fetch cookie consent settings: ${error}`);
    }

    // Calculate checksum for the site settings string
    const siteSettingsChecksum = await this.#getChecksum(siteSettingsRaw);

    // Parse the fetched site settings string to JSON
    let siteSettings;
    try {
      siteSettings = JSON.parse(siteSettingsRaw);
    } catch (error) {
      throw new Error(`Cookie consent settings parsing failed: ${error}`);
    }

    // Add checksum to the settings object, so that we do not need to recalculate it when saving the cookie
    siteSettings.checksum = siteSettingsChecksum;
    return siteSettings;
  }

  /**
   * Retrieves the site settings and performs necessary checks.
   * @private
   * @param {boolean} [isBanner=true] - Optional parameter to bypass certain checks when settings page is being rendered.
   * @return {Promise<unknown>} A promise that resolves to the result of removing invalid groups from the site settings.
   * @throws {Error} If the required group or cookie is missing in the site settings.
   * @throws {Error} If there are multiple cookie groups with identical names in the site settings.
   */
  async #getSiteSettings(isBanner = true) {
    const siteSettings = await this.#getSiteSettingsFromJsonFile();

    this.#cookie_name = siteSettings.cookieName || this.#cookie_name; // Optional override for cookie name

    // Compare file checksum with browser cookie checksum if the file has not changed and return false for no change (no banner needed)
    const browserCookie = this.#getCookie();
    if (browserCookie) {
      // Check if settings have not changed and browser cookie has 'showBanner' set to false
      if (isBanner && !browserCookie.showBanner && (siteSettings.checksum === browserCookie.checksum)) {
        // console.log('Settings were unchanged');
        return this.#UNCHANGED;
      }
    }

    const essentialGroup = siteSettings.requiredCookies.groups.find(group => group.groupId === this.#ESSENTIAL_GROUP_NAME);
    if (!essentialGroup) {
      // The site site settings must have required group named by ESSENTIAL_GROUP_NAME
      throw new Error(`Cookie consent error: '${this.#ESSENTIAL_GROUP_NAME}' group missing`);
    }
    const requiredCookieFound = essentialGroup.cookies.find(cookie => cookie.name === this.#cookie_name);
    if (!requiredCookieFound) {
      // The required "essential" group must have cookie with name matching the root level 'cookieName'
      throw new Error(`Cookie consent error: Missing cookie entry for '${this.#cookie_name}' in group '${this.#ESSENTIAL_GROUP_NAME}'`);
    }

    const siteSettingsGroups = [...siteSettings.requiredCookies.groups, ...siteSettings.optionalCookies.groups];

    const cookieNames = [];
    siteSettingsGroups.forEach(cookie => {
      if (cookieNames.includes(cookie.groupId)) {
        // The site settings must not contain cookie groups that have identical names
        throw new Error(`Cookie consent error: Group '${cookie.groupId}' found multiple times in settings.`);
      }
      cookieNames.push(cookie.groupId);
    });

    // Checksums for all groups calculated in parallel without waiting for each
    await Promise.all(siteSettingsGroups.map(async (group) => {
      group.checksum = await this.#getChecksum(group); // This await is needed to ensure that all checksums are calculated before continuing
    }));

    return this.#removeInvalidGroupsFromCookie(siteSettingsGroups, browserCookie, siteSettings);
  }


  /**
   * Reads the group selections from the given form.
   * @private
   * @param {HTMLFormElement} form - The form element to read the group selections from.
   * @param {boolean} [all=false] - Optional parameter to include all selections, regardless of their checked state.
   * @return {Array<string>} - An array of selected groups.
   */
  #readGroupSelections(form, all = false) {
    const groupSelections = [];
    const formCheckboxes = form.querySelectorAll('input');
    formCheckboxes.forEach(check => {
      if(check.checked || all) {
        groupSelections.push(check.dataset.group);
      }
    });

    return groupSelections;
  }

  /**
   * Handles button events based on the selection.
   * @private
   * @param {string} selection - The selection type ('required', 'all', 'selected').
   * @param {object} formReference - The reference to the form.
   * @param {object} siteSettings - The site settings object.
   * @return {void}
   */
  #handleButtonEvents(selection, formReference, siteSettings) {
    let acceptedGroups = [];
    switch (selection) {
      case 'required': {
        acceptedGroups = [this.#ESSENTIAL_GROUP_NAME];
        this.#saveAcceptedGroups(siteSettings, acceptedGroups, false);
        break;
      }
      case 'all': {
        acceptedGroups = this.#readGroupSelections(formReference, true);
        this.#saveAcceptedGroups(siteSettings, acceptedGroups, false);
        break;
      }
      case 'selected': {
        acceptedGroups = this.#readGroupSelections(formReference);
        this.#saveAcceptedGroups(siteSettings, acceptedGroups, false);
        break;
      }
      default:
        // We should not be here, better do nothing
        break;
    }
    if (!this.#SUBMIT_EVENT) {
      window.location.reload();
    } else {
      window.dispatchEvent(new CustomEvent(this.#SUBMIT_EVENT, { detail: { acceptedGroups } }));

      // Handle selector and removal of banner depending on rendering mode: banner or page.
      let ariaSelector = this.#TARGET_SELECTOR;
      let ariaParentElement;
      if (this.#settingsPageElement) {
        ariaSelector = this.#SETTINGS_PAGE_SELECTOR;
        ariaParentElement = this.#settingsPageElement;
      } else {
        ariaParentElement = document.querySelector(this.#TARGET_SELECTOR);
        this.#removeBanner();
      }

      // Announce settings saved to screen readers
      const ARIA_LIVE_ID = 'hds-cc-aria-live';
      const SHOW_ARIA_LIVE_FOR_MS = 5000;
      if (!ariaParentElement) {
        throw new Error(`Cookie consent: Aria notification parent element '${ariaSelector}'  was not found`);
      }
      const ariaLive = document.createElement('div');
      ariaLive.id = ARIA_LIVE_ID;
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.style = 'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      ariaLive.textContent = getTranslation('settingsSaved', this.#LANGUAGE);
      ariaParentElement.appendChild(ariaLive);

      // Remove ariaLive after 5 seconds
      setTimeout(() => {
        const ariaLiveElem = document.getElementById(ARIA_LIVE_ID);
        if (ariaLiveElem) {
          ariaLiveElem.remove();
        }
      }, SHOW_ARIA_LIVE_FOR_MS);
    }
  }

  // MARK: Rendering

  /**
   * Determines whether to display the banner.
   * 1. If site settings have changed since approval, show banner
   * 2. If cookie doesn't exist, show banner
   * 3. If cookie wants to show banner, show banner
   * 4. Otherwise, do not show banner
   * @private
   * @param {any} siteSettings - The site settings.
   * @return {boolean} - Returns true if the banner should be displayed, false otherwise.
   */
  #shouldDisplayBanner(siteSettings) {
    if (siteSettings !== this.#UNCHANGED) {
      return true; // Site settings changed since approval, show banner
    }

    const browserCookie = this.#getCookie();
    if (!browserCookie) {
      return true; // Cookie doesn't exist, show banner
    }

    if (browserCookie.showBanner) {
      return true; // Cookie wants to show banner
    }

    return false; // All checks passed, no need for banner
  }

  /**
   * Picks the proper translation from a given object of possible translations or returns the input string if not an object.
   * Defaults to English ('en') if the specified translation is not found.
   * @private
   * @param {string|Object} translationObj - Either a string or an object containing language key to translation value pairs.
   * @param {string} lang - Language key, e.g., 'fi' for Finnish.
   * @return {string} - Translated string based on the provided language key, or the original string if `translationObj` is not an object.
   */
  #translateSetting(translationObj, lang) {
    if (typeof (translationObj) === 'object') {
      if (translationObj[lang] === undefined) {
        return translationObj.en; // fallback to English translation
      }
      return translationObj[lang];
    }
    return translationObj;
  }

  /**
   * Retrieves the HTML representation of cookie groups.
   * @private
   * @param {Array} cookieGroupList - The list of cookie groups.
   * @param {string} lang - The language code.
   * @param {Object} translations - The translations object.
   * @param {boolean} groupRequired - Indicates if the group is required.
   * @param {string} cookieGroupCategoryName - The name of the category for these groups (ie. 'required' or 'optional').
   * @param {Array} acceptedGroups - The list of accepted group IDs.
   * @return {string} - The HTML representation of cookie groups.
   */
  #getCookieGroupsHtml(cookieGroupList, lang, translations, groupRequired, cookieGroupCategoryName, acceptedGroups) {
    let groupsHtml = '';
    let groupNumber = 0;
    cookieGroupList.forEach(cookieGroup => {
      const title = this.#translateSetting(cookieGroup.title, lang);
      const description = this.#translateSetting(cookieGroup.description, lang);
      const {groupId} = cookieGroup;

      // Build table rows
      let tableRowsHtml = '';
      cookieGroup.cookies.forEach(cookie => {
        tableRowsHtml += getTableRowHtml(
          {
            name: this.#translateSetting(cookie.name, lang),
            host: this.#translateSetting(cookie.host, lang),
            description: this.#translateSetting(cookie.description, lang),
            expiration: this.#translateSetting(cookie.expiration, lang),
            type: getTranslation(`type_${cookie.type}`, lang),
          }
        );
      });

      const isAccepted = acceptedGroups.includes(cookieGroup.groupId);
      groupsHtml += getGroupHtml({...translations, title, description }, groupId, `${cookieGroupCategoryName}_${groupNumber}`, tableRowsHtml, groupRequired, isAccepted);
      groupNumber += 1;
    });
    return groupsHtml;
  }

  /**
   * Temporary solition to inject CSS styles into the shadow root.
   * @private
   * @param {ShadowRoot} shadowRoot - The shadow root element to inject the styles into.
   * @return {Promise<void>} - A promise that resolves when the styles are injected successfully.
   * @throws {Error} - If there is an error fetching or injecting the styles.
   */
  async #injectCssStyles(shadowRoot) {
    // TODO: Replace this temporary CSS file hack with proper preprocess CSS inlining
    // Fetch the external CSS file
    try {
      const response = await fetch(this.#TEMP_CSS_PATH);
      const cssText = await response.text();

      // Create and inject the style
      const style = document.createElement('style');
      style.textContent = cssText;
      shadowRoot.appendChild(style);
    } catch (error) {
      throw new Error(`Cookie consent: Failed to load the temporary CSS file solution: '${error}'`);
    }
  }

  /**
   * Renders the cookie consent banner or page element.
   * @private
   * @param {string} lang - The language for translations.
   * @param {Object} siteSettings - The site settings object.
   * @param {boolean} isBanner - Indicates if rendering banner or page element.
   * @param {HTMLElement} renderTarget - The target element for rendering the page element, unset otherwise.
   * @throws {Error} If the targetSelector element is not found.
   * @throws {Error} If the spacerParentSelector element is not found.
   * @throws {Error} If the contentSelector element is not found.
   * @throws {Error} If failed to load the temporary CSS file solution.
   */
  async #render(lang, siteSettings, isBanner, renderTarget = null) {
    let spacerParent;
    if (isBanner) {
      const bannerTarget = document.querySelector(this.#TARGET_SELECTOR);
      if (!bannerTarget) {
        throw new Error(`Cookie consent: targetSelector element '${this.#TARGET_SELECTOR}'  was not found`);
      }
      spacerParent = document.querySelector(this.#SPACER_PARENT_SELECTOR);
      if (!spacerParent) {
        throw new Error(`Cookie consent: The spacerParentSelector element '${this.#SPACER_PARENT_SELECTOR}' was not found`);
      }
      if (!document.querySelector(this.#PAGE_CONTENT_SELECTOR)) {
        throw new Error(`Cookie consent: contentSelector element '${this.#PAGE_CONTENT_SELECTOR}' was not found`);
      }
      renderTarget = bannerTarget;
    }

    const container = document.createElement('div');
    container.classList.add('hds-cc__target');
    container.style.all = 'initial';
    if (!isBanner) {
      renderTarget.innerHTML = '';
    }
    renderTarget.prepend(container);
    const shadowRoot = container.attachShadow({ mode: 'open' });
    this.#shadowRoot = shadowRoot;

    // Inject CSS styles
    await this.#injectCssStyles(shadowRoot);

    const translations = {};
    const translationKeys = getTranslationKeys();
    translationKeys.forEach(key => {
      translations[key] = getTranslation(key, lang, siteSettings);
    });

    let browserCookie = false;
    let listOfAcceptedGroups = [];
    try {
      // Check which cookies are accepted at this point to check boxes on form render.
      browserCookie = this.#getCookie();
      listOfAcceptedGroups = [...Object.keys(browserCookie.groups)];
    } catch (err) {
      // There was no cookie, the list stays empty.
    }

    let groupsHtml = '';
    groupsHtml += this.#getCookieGroupsHtml(siteSettings.requiredCookies.groups, lang, translations, true, 'required', listOfAcceptedGroups);
    groupsHtml += this.#getCookieGroupsHtml(siteSettings.optionalCookies.groups, lang, translations, false, 'optional', listOfAcceptedGroups);

    // Create banner HTML
    shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml, isBanner);

    // Add button events
    const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
    const shadowRootForm = shadowRoot.querySelector('form');
    cookieButtons.forEach(button => button.addEventListener('click', e => {
      this.#handleButtonEvents(e.target.dataset.approved, shadowRootForm, siteSettings);
    }));

    if (isBanner) {
      this.#bannerElements.bannerContainer = container;

      // Add scroll-margin-bottom to all elements inside the contentSelector
      const style = document.createElement('style');
      style.innerHTML = `${this.#PAGE_CONTENT_SELECTOR} * {scroll-margin-bottom: calc(var(--hds-cookie-consent-height, -8px) + 8px);}`;
      document.head.appendChild(style);

      // Add spacer inside spacerParent (to the bottom of the page)
      const spacer = document.createElement('div');
      this.#bannerElements.spacer = spacer;
      spacer.id = 'hds-cc__spacer';
      spacerParent.appendChild(spacer);
      spacer.style.height = 'var(--hds-cookie-consent-height, 0)';

      // Update spacer and scroll-margin-bottom on banner resize
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          document.documentElement.style.setProperty('--hds-cookie-consent-height', `${parseInt(entry.contentRect.height, 10) + parseInt(getComputedStyle(entry.target).borderTopWidth, 10)}px`);
          // spacer.style.height = `${entry.contentRect.height + parseInt(getComputedStyle(entry.target).borderTopWidth, 10)}px`;
        });
      });
      const bannerHeightElement = shadowRoot.querySelector('.hds-cc__container');
      resizeObserver.observe(bannerHeightElement);
      this.#resizeReference.resizeObserver = resizeObserver;
      this.#resizeReference.bannerHeightElement = bannerHeightElement;

      shadowRoot.querySelector('.hds-cc').focus();
    }
  }

  // MARK: Monitoring

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

    const consentCookie = this.#getCookie();
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

  // MARK: Initializer

  /**
   * Initializes the component by removing the banner, retrieving site settings,
   * and rendering the banner if necessary.
   *
   * @private
   * @return {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async #init() {
    this.#removeBanner();

    let settingsPageElement = null;
    // If settings page selector is enabled, check if the element exists
    if (this.#SETTINGS_PAGE_SELECTOR) {
      settingsPageElement = document.querySelector(this.#SETTINGS_PAGE_SELECTOR);
    }

    if (settingsPageElement) {
      const siteSettings = await this.#getSiteSettings(false);
      this.#settingsPageElement = settingsPageElement;
      // If settings page element is found, render site settings in page instead of banner
      await this.#render(this.#LANGUAGE, siteSettings, false, settingsPageElement);
    } else {
      const siteSettings = await this.#getSiteSettings();
      // Check if banner is needed or not
      const shouldDisplayBanner = this.#shouldDisplayBanner(siteSettings);
      if (shouldDisplayBanner) {
        await this.#render(this.#LANGUAGE, siteSettings, true);
      }
    }

    if (this.#MONITOR_INTERVAL > 0) {
      this.#monitorCookiesAndStorage();
    }
  };
}

window.hds = window.hds || {};
window.hds.CookieConsentClass = HdsCookieConsentClass;

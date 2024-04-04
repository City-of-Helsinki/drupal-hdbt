/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */

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

class HdsCookieConsentClass {
  #SITE_SETTINGS_JSON_URL;
  #LANGUAGE;
  #TARGET_SELECTOR;
  #SPACER_PARENT_SELECTOR;
  #PAGE_CONTENT_SELECTOR;
  #TEMP_CSS_PATH;
  #COOKIE_DAYS;
  #UNCHANGED;
  #ESSENTIAL_GROUP_NAME;
  #SUBMIT_EVENT = false;

  constructor(
    {
      siteSettingsJsonUrl, // Path to JSON file with cookie settings
      language = 'en', // Page language
      targetSelector = 'body', // Where to inject the banner
      spacerParentSelector = 'body', // Where to inject the spacer
      pageContentSelector = 'body', // Where to add scroll-margin-bottom
      submitEvent = false, // if string, do not reload page, but submit the string as event after consent
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
    this.#TEMP_CSS_PATH = tempCssPath;
    this.#SUBMIT_EVENT = submitEvent;

    this.#COOKIE_DAYS = 100;
    this.#UNCHANGED = 'unchanged';
    this.#ESSENTIAL_GROUP_NAME = 'essential';

    this.shadowRoot = null;
    this.bannerElements = {
      bannerContainer: null,
      spacer: null,
    };
    this.resizeReference = {
      resizeObserver: null,
      bannerHeightElement: null,
    };
    this.cookie_name = 'city-of-helsinki-cookie-consents'; // Overridable default value

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
   * @returns {Promise<boolean>} A promise that resolves to true if all the groups are accepted, otherwise false.
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

  async setGroupsStatusToAccepted(acceptedGroupsArray) {
    const browserCookie = this.#getCookie();
    const showBanner = browserCookie?.showBanner || false;

    // If cookie is set, get the accepted groups
    let currentlyAccepted = [];
    if (browserCookie) {
      currentlyAccepted = Object.keys(browserCookie.groups);
    }

    // Try to fetch the cookie settings from the JSON file
    let cookieSettings = null;
    try {
      cookieSettings = await this.#getCookieSettingsFromJsonFile();
    } catch (err) {
      console.error(`Cookie consent: Unable to fetch cookie consent settings: ${err}`);
      return false;
    }

    const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

    // Checksums for all groups calculated in parallel without waiting for each
    await Promise.all(cookieSettingsGroups.map(async (group) => {
      group.checksum = await this.#getChecksum(group);
    }));

    // Save chat group to accepted groups and update checkbox state
    this.#saveAcceptedGroups(cookieSettings, [...currentlyAccepted, ...acceptedGroupsArray], showBanner);
    return true;
  }

  /**
   * Get checksum from string
   * @param {String} str to be hashed
   * @return {String} Hash in base16 from the string
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
   * Centralized browser cookie reading. Returns false if the cookie
   * with specified name doesn't exist.
   */
  #getCookie() {
    try {
      const cookieString = parse(document.cookie)[this.cookie_name];
      if (!cookieString) {
        console.log('Cookie is not set');
        return false;
      }
      return JSON.parse(cookieString);
    } catch (err) {
      console.log(`Cookie parsing unsuccessful:\n${err}`);
      return false;
    }
  }


  /**
   * Removes the banner elements from DOM like the shadow root and spacer.
   */
  #removeBanner() {
    // Remove banner size observer
    if (this.resizeReference.resizeObserver && this.resizeReference.bannerHeightElement) {
      this.resizeReference.resizeObserver.unobserve(this.resizeReference.bannerHeightElement);
    }
    // Remove banner elements
    if (this.bannerElements.bannerContainer) {
      this.bannerElements.bannerContainer.remove();
    }
    if (this.bannerElements.spacer) {
      this.bannerElements.spacer.remove();
    }
    // Remove scroll-margin-bottom variable from all elements inside the contentSelector
    document.documentElement.style.removeProperty('--hds-cookie-consent-height');
  }


  /**
   * Sets a cookie with the provided data.
   *
   * @private
   * @param {Object} cookieData - The data to be stored in the cookie.
   */
  #setCookie(cookieData) {
    // console.log('#setCookie', cookieData);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.#COOKIE_DAYS);
    document.cookie = serialize(this.cookie_name, JSON.stringify(cookieData), { expires: expiryDate });
  }


  /**
   * Saves the accepted cookie groups to cookie, unsets others.
   *
   * @param {Object} cookieSettings - Site specific settings
   * @param {Array} acceptedGroupNames - The names of the accepted cookie groups.
   * @param {boolean} showBanner - Whether to show the banner or not.
   */
  #saveAcceptedGroups(cookieSettings, acceptedGroupNames = [], showBanner = false) {
    // console.log('Saving accepted cookie groups:', acceptedGroupNames);

    const acceptedGroups = {};

    // Find group checksums for accepted groups
    const bothGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];
    bothGroups.forEach(group => {
      if (acceptedGroupNames.includes(group.groupId)) {
        acceptedGroups[group.groupId] = group.checksum;
      }
    });

    const data = {
      checksum: cookieSettings.checksum,
      groups: acceptedGroups,
      ...(showBanner && { showBanner: true }), // Only add showBanner if it's true
    };

    this.#setCookie(data);

    // Update the checkboxes to reflect the new state (if called outside)
    if (this.shadowRoot) {
      const form = this.shadowRoot.querySelector('form');
      if (form) {
        const formCheckboxes = form.querySelectorAll('input');

        formCheckboxes.forEach(check => {
          if (acceptedGroupNames.includes(check.dataset.group)) {
            check.checked = true;
          }
        });
      }
    }
  }

  async #removeInvalidGroupsFromCookie(cookieSettingsGroups, browserCookieState, cookieSettings) {
    // console.log('#removeInvalidGroupsFromCookie', cookieSettingsGroups, browserCookieState, cookieSettings);

    const newCookieGroups = [];

    // If browser cookie has groups
    if (browserCookieState.groups) {

      // Loop through groups in cookie settings
      cookieSettingsGroups.forEach(cookieSettingsGroup => {
        const browserGroupName = cookieSettingsGroup.groupId;
        const matchedBrowserGroup = browserCookieState.groups[browserGroupName];
        if (matchedBrowserGroup) {

          // If group names match
          if (browserGroupName === cookieSettingsGroup.groupId) {

            // If checksums match, add to new cookie groups
            if (browserCookieState.groups[browserGroupName] === cookieSettingsGroup.checksum) {
              newCookieGroups.push(cookieSettingsGroup.groupId);
            } else {
              console.log(`Checksums do not match for group: '${cookieSettingsGroup.groupId}', removing from cookie accepted.`);
            }
          }
        }
      });
    };

    // Because global checksum did not match, group checksums were checked and non-matching groups were removed, save the cleaned cookie
    const showBanner = true;
    this.#saveAcceptedGroups(cookieSettings, newCookieGroups, showBanner);

    return cookieSettings;
  }

  async #getCookieSettingsFromJsonFile() {
    // Fetch the site settings JSON file
    let cookieSettingsRaw;
    try {
      cookieSettingsRaw = await fetch(this.#SITE_SETTINGS_JSON_URL).then((response) => response.text());
    } catch (error) {
      throw new Error(`Cookie consent: Unable to fetch cookie consent settings: ${error}`);
    }

    // Calculate checksum for the site settings string
    const cookieSettingsChecksum = await this.#getChecksum(cookieSettingsRaw);

    // Parse the fetched site settings string to JSON
    let cookieSettings;
    try {
      cookieSettings = JSON.parse(cookieSettingsRaw);
    } catch (error) {
      throw new Error(`Cookie consent settings parsing failed: ${error}`);
    }

    // Add checksum to the settings object, so that we do not need to recalculate it when saving the cookie
    cookieSettings.checksum = cookieSettingsChecksum;
    return cookieSettings;
  }

  async #getCookieSettings() {
    const cookieSettings = await this.#getCookieSettingsFromJsonFile();

    this.cookie_name = cookieSettings.cookieName || this.cookie_name; // Optional override for cookie name

    // Compare file checksum with browser cookie checksum if the file has not changed and return false for no change (no banner needed)
    const browserCookie = this.#getCookie();
    if (browserCookie) {
      // Check if settings have not changed and browser cookie has 'showBanner' set to false
      if (!browserCookie.showBanner && (cookieSettings.checksum === browserCookie.checksum)) {
        console.log('Settings were unchanged');
        return this.#UNCHANGED;
      }
    }

    const essentialGroup = cookieSettings.requiredCookies.groups.find(group => group.groupId === this.#ESSENTIAL_GROUP_NAME);
    if (!essentialGroup) {
      // The site cookie settings must have required group named by ESSENTIAL_GROUP_NAME
      throw new Error(`Cookie consent error: '${this.#ESSENTIAL_GROUP_NAME}' group missing`);
    }
    const requiredCookieFound = essentialGroup.cookies.find(cookie => cookie.name === this.cookie_name);
    if (!requiredCookieFound) {
      // The required "essential" group must have cookie with name matching the root level 'cookieName'
      throw new Error(`Cookie consent error: Missing cookie entry for '${this.cookie_name}' in group '${this.#ESSENTIAL_GROUP_NAME}'`);
    }

    const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

    const cookieNames = [];
    cookieSettingsGroups.forEach(cookie => {
      if (cookieNames.includes(cookie.groupId)) {
        // The cookie settings must not contain cookie groups that have identical names
        throw new Error(`Cookie consent error: Group '${cookie.groupId}' found multiple times in settings.`);
      }
      cookieNames.push(cookie.groupId);
    });

    // Checksums for all groups calculated in parallel without waiting for each
    await Promise.all(cookieSettingsGroups.map(async (group) => {
      group.checksum = await this.#getChecksum(group); // This await is needed to ensure that all checksums are calculated before continuing
    }));

    return this.#removeInvalidGroupsFromCookie(cookieSettingsGroups, browserCookie, cookieSettings);
  }


  /**
   * Go through form and get accepted groups. Return a list of group ID's.
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

  #handleButtonEvents(selection, formReference, cookieSettings) {
    let acceptedGroups = [];
    switch (selection) {
      case 'required': {
        acceptedGroups = [this.#ESSENTIAL_GROUP_NAME];
        this.#saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'all': {
        acceptedGroups = this.#readGroupSelections(formReference, true);
        this.#saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'selected': {
        acceptedGroups = this.#readGroupSelections(formReference);
        this.#saveAcceptedGroups(cookieSettings, acceptedGroups);
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
      this.#removeBanner();
    }

  }

  /**
   * logic for cookie banner spawn
   *   compare cookieSettings and browser cookie state
   *   check 1. if cookie exists 2. essentials approved 3. hash match - show banner
   *   else show banner
   */
  #shouldDisplayBanner(cookieSettings) {
    if (cookieSettings !== this.#UNCHANGED) {
      console.log('Cookie settings changed since approval, show banner');
      return true;
    }

    const browserCookie = this.#getCookie();
    if (!browserCookie) {
      console.log('Cookie doesn\'t exist, show banner');
      return true;
    }

    if (browserCookie.showBanner) {
      console.log('Cookie wants to show banner');
      return true;
    }

    console.log('All checks passed, no need for banner');
    return false;
  }

  /**
   * Template building section
   */

  /**
   * Picks the proper translation from a given object of possible translations or returns the input string if not an object.
   * Defaults to English ('en') if the specified translation is not found.
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

  #getCookieGroupsHtml(cookieGroupList, lang, translations, groupRequired, groupName, acceptedGroups) {
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
      groupsHtml += getGroupHtml({...translations, title, description }, groupId, `${groupName}_${groupNumber}`, tableRowsHtml, groupRequired, isAccepted);
      groupNumber += 1;
    });
    return groupsHtml;
  }

  async #renderBanner(lang, cookieSettings) {
    const bannerTarget = document.querySelector(this.#TARGET_SELECTOR);
    if (!bannerTarget) {
      throw new Error(`Cookie consent: targetSelector element '${this.#TARGET_SELECTOR}'  was not found`);
    }
    const spacerParent = document.querySelector(this.#SPACER_PARENT_SELECTOR);
    if (!spacerParent) {
      throw new Error(`Cookie consent: The spacerParentSelector element '${this.#SPACER_PARENT_SELECTOR}' was not found`);
    }
    if (!document.querySelector(this.#PAGE_CONTENT_SELECTOR)) {
      throw new Error(`Cookie consent: contentSelector element '${this.#PAGE_CONTENT_SELECTOR}' was not found`);
    }

    const bannerContainer = document.createElement('div');
    bannerContainer.classList.add('hds-cc__target');
    bannerContainer.style.all = 'initial';
    bannerTarget.prepend(bannerContainer);
    this.bannerElements.bannerContainer = bannerContainer;
    const shadowRoot = bannerContainer.attachShadow({ mode: 'open' });
    this.shadowRoot = shadowRoot;

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

    const translations = {};
    const translationKeys = getTranslationKeys();
    translationKeys.forEach(key => {
      translations[key] = getTranslation(key, lang, cookieSettings);
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
    groupsHtml += this.#getCookieGroupsHtml(cookieSettings.requiredCookies.groups, lang, translations, true, 'required', listOfAcceptedGroups);
    groupsHtml += this.#getCookieGroupsHtml(cookieSettings.optionalCookies.groups, lang, translations, false, 'optional', listOfAcceptedGroups);

    // Create banner HTML
    shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

    // Add scroll-margin-bottom to all elements inside the contentSelector
    const style = document.createElement('style');
    style.innerHTML = `${this.#PAGE_CONTENT_SELECTOR} * {scroll-margin-bottom: calc(var(--hds-cookie-consent-height, -8px) + 8px);}`;
    document.head.appendChild(style);

    // Add spacer inside spacerParent (to the bottom of the page)
    const spacer = document.createElement('div');
    this.bannerElements.spacer = spacer;
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
    this.resizeReference.resizeObserver = resizeObserver;
    this.resizeReference.bannerHeightElement = bannerHeightElement;

    // Add button events
    const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
    const shadowRootForm = shadowRoot.querySelector('form');
    cookieButtons.forEach(button => button.addEventListener('click', e => {
      this.#handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieSettings);
    }));

    shadowRoot.querySelector('.hds-cc').focus();
  }

  async #init() {
    this.#removeBanner();
    const cookieSettings = await this.#getCookieSettings();

    // If cookie settings have not changed, do not show banner, otherwise, check
    const shouldDisplayBanner = this.#shouldDisplayBanner(cookieSettings);
    if (shouldDisplayBanner) {
      await this.#renderBanner(this.#LANGUAGE, cookieSettings);
    }
  };
}
window.hds = window.hds || {};
window.hds.CookieConsentClass = HdsCookieConsentClass;


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

class HDSCookieConsent {
  constructor() {
    this.COOKIE_NAME = 'city-of-helsinki-cookie-consents'; // Overridable default value
    this.COOKIE_DAYS = 100;
    this.UNCHANGED = 'unchanged';
    this.ESSENTIAL_GROUP_NAME = 'essential';

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  /**
   * Get checksum from string
   * @param {String} str to be hashed
   * @return {String} Hash in base16 from the string
   *
   * Reference: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
   */
  async getChecksum(message, length = 8) {
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
   * Cookie section
   */

  /**
   * Centralized browser cookie reading. Returns false if the cookie
   * with specified name doesn't exist.
   */
  async getCookie() {
    try {
      const cookieString = parse(document.cookie)[this.COOKIE_NAME];
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

  async setCookie(cookieData) {
    // console.log('setCookie', cookieData);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.COOKIE_DAYS);
    document.cookie = serialize(this.COOKIE_NAME, JSON.stringify(cookieData), { expires: expiryDate });
  }

  saveAcceptedGroups(cookieSettings, acceptedGroupNames = [], showBanner = false) {
    // console.log('Accepting cookies from groups:', acceptedGroupNames);

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

    this.setCookie(data);
  }

  async removeInvalidGroupsFromCookie(cookieSettingsGroups, browserCookieState, cookieSettings) {
    // console.log('removeInvalidGroupsFromCookie', cookieSettingsGroups, browserCookieState, cookieSettings);

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
    this.saveAcceptedGroups(cookieSettings, newCookieGroups, showBanner);

    return cookieSettings;
  }

  async getCookieSettingsFromJsonFile() {
    // Get the site settings (prefetch) link element
    const siteSettingsElem = document.querySelector('link#hdsCookieConsentSiteSettings');
    if (!siteSettingsElem) {
      throw new Error('Cookie consent: Site settings link not found');
    }

    // Use prefetch link elements href to fetch the site settings string
    let cookieSettingsRaw;
    try {
      cookieSettingsRaw = await fetch(siteSettingsElem.href).then((response) => response.text());
    } catch (error) {
      throw new Error(`Cookie consent: Unable to fetch cookie consent settings: ${error}`);
    }

    // Calculate checksum for the site settings string
    const cookieSettingsChecksum = await this.getChecksum(cookieSettingsRaw);

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

  async getCookieSettings() {
    const cookieSettings = await this.getCookieSettingsFromJsonFile();

    this.COOKIE_NAME = cookieSettings.cookieName || this.COOKIE_NAME; // Optional override for cookie name

    // Compare file checksum with browser cookie checksum if the file has not changed and return false for no change (no banner needed)
    const browserCookie = await this.getCookie();
    if (browserCookie) {
      // Check if settings have not changed and browser cookie has 'showBanner' set to false
      if (!browserCookie.showBanner && (cookieSettings.checksum === browserCookie.checksum)) {
        console.log('Settings were unchanged');
        return this.UNCHANGED;
      }
    }

    const essentialGroup = cookieSettings.requiredCookies.groups.find(group => group.groupId === this.ESSENTIAL_GROUP_NAME);
    if (!essentialGroup) {
      // The site cookie settings must have required group named by ESSENTIAL_GROUP_NAME
      throw new Error(`Cookie consent error: '${this.ESSENTIAL_GROUP_NAME}' group missing`);
    }
    const requiredCookieFound = essentialGroup.cookies.find(cookie => cookie.name === this.COOKIE_NAME);
    if (!requiredCookieFound) {
      // The required "essential" group must have cookie with name matching the root level 'cookieName'
      throw new Error(`Cookie consent error: Missing cookie entry for '${this.COOKIE_NAME}' in group '${this.ESSENTIAL_GROUP_NAME}'`);
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
      group.checksum = await this.getChecksum(group); // This await is needed to ensure that all checksums are calculated before continuing
    }));

    return this.removeInvalidGroupsFromCookie(cookieSettingsGroups, browserCookie, cookieSettings);
  }


  handleButtonEvents(selection, formReference, cookieSettings) {

    /**
     * Go through form and get accepted groups. Return a list of group ID's.
     */
    function readGroupSelections(form, all = false) {
      const groupSelections = [];
      const formCheckboxes = form.querySelectorAll('input');
      formCheckboxes.forEach(check => {
        if(check.checked || all) {
          groupSelections.push(check.dataset.group);
        }
      });

      return groupSelections;
    }

    switch (selection) {
      case 'required': {
        const acceptedGroups = [this.ESSENTIAL_GROUP_NAME];
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'all': {
        const acceptedGroups = readGroupSelections(formReference, true);
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'selected': {
        const acceptedGroups = readGroupSelections(formReference);
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      default:
        // We should not be here, better do nothing
        break;
    }
    window.location.reload();
  }

  async areTheseGroupsAccepted(groupNamesArray) {
    const browserCookieState = await this.getCookie();

    // Check if our cookie exists and has groups set
    if (!browserCookieState || !browserCookieState.groups) {
      console.log('Cookie is not set properly', browserCookieState, browserCookieState.groups);
      return false;
    }

    // Check if all groups are in accepted groups
    return groupNamesArray.every(groupName => !!browserCookieState.groups[groupName]);
  }

  /**
   * logic for cookie banner spawn
   *   compare cookieSettings and browser cookie state
   *   check 1. if cookie exists 2. essentials approved 3. hash match - show banner
   *   else show banner
   */
  async shouldDisplayBanner(cookieSettings) {
    if (cookieSettings !== this.UNCHANGED) {
      console.log('Cookie settings changed since approval, show banner');
      return true;
    }

    const browserCookie = await this.getCookie();
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
  translateSetting(translationObj, lang) {
    if (typeof (translationObj) === 'object') {
      if (translationObj[lang] === undefined) {
        return translationObj.en; // fallback to English translation
      }
      return translationObj[lang];
    }
    return translationObj;
  }

  getCookieGroupsHtml(cookieGroupList, lang, translations, groupRequired, groupName, acceptedGroups) {
    let groupsHtml = '';
    let groupNumber = 0;
    cookieGroupList.forEach(cookieGroup => {
      const title = this.translateSetting(cookieGroup.title, lang);
      const description = this.translateSetting(cookieGroup.description, lang);
      const {groupId} = cookieGroup;

      // Build table rows
      let tableRowsHtml = '';
      cookieGroup.cookies.forEach(cookie => {
        tableRowsHtml += getTableRowHtml(
          {
            name: this.translateSetting(cookie.name, lang),
            host: this.translateSetting(cookie.host, lang),
            description: this.translateSetting(cookie.description, lang),
            expiration: this.translateSetting(cookie.expiration, lang),
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

  /*
  * ================================================================
  * =====                                                   ========
  * =====                   INIT SEQUENCE                   ========
  * =====                                                   ========
  * ================================================================
  */

  /**
   * Control form checkbox states
   *
   * Due to shadowroot approach we use window scoped custom events
   * to trigger the form checking in cases where the form is open
   * and user gives chat consent from chat window instead of the
   * form checkboxes. The form reference is passed here on init phase.
   */
  controlForm(form) {
    const checkGroupBox = (groups) => {
      const formCheckboxes = form.querySelectorAll('input');

      formCheckboxes.forEach(check => {
        if (groups.includes(check.dataset.group)) {
          check.checked = true;
        }
      });
    };

    window.addEventListener('CONSENTS_CHANGED', e => {
      console.log('Oh dear, looks like something consented for group and it was not the end user!');
      checkGroupBox(e.detail.groups);
    });
  }

  async renderBanner(lang, cookieSettings) {
    const targetSelector = window.hdsCookieConsentPageSettings.targetSelector || 'body';
    const bannerTarget = document.querySelector(targetSelector);
    if (!bannerTarget) {
      throw new Error('targetSelector element was not found');
    }
    const spacerParentSelector = window.hdsCookieConsentPageSettings.spacerParentSelector || 'body';
    const spacerParent = document.querySelector(spacerParentSelector);
    if (!spacerParent) {
      throw new Error('spacerParentSelector element was not found');
    }
    const contentSelector = window.hdsCookieConsentPageSettings.pageContentSelector || 'body';
    if (!document.querySelector(contentSelector)) {
      throw new Error('contentSelector element was not found');
    }

    const bannerContainer = document.createElement('div');
    bannerContainer.classList.add('hds-cc__target');
    bannerContainer.style.all = 'initial';
    bannerTarget.prepend(bannerContainer);
    const shadowRoot = bannerContainer.attachShadow({ mode: 'open' });

    // Fetch the external CSS file
    try {
      const response = await fetch(window.hdsCookieConsentPageSettings.tempCssPath);
      const cssText = await response.text();

      // Create and inject the style
      const style = document.createElement('style');
      style.textContent = cssText;
      shadowRoot.appendChild(style);
    } catch (error) {
      throw new Error('Failed to load the CSS file:', error);
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
      browserCookie = await this.getCookie();
      listOfAcceptedGroups = [...Object.keys(browserCookie.groups)];
    } catch (err) {
      // There was no cookie, the list stays empty.
    }

    let groupsHtml = '';
    groupsHtml += this.getCookieGroupsHtml(cookieSettings.requiredCookies.groups, lang, translations, true, 'required', listOfAcceptedGroups);
    groupsHtml += this.getCookieGroupsHtml(cookieSettings.optionalCookies.groups, lang, translations, false, 'optional', listOfAcceptedGroups);

    // Create banner HTML
    shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

    // Add scroll-margin-bottom to all elements inside the contentSelector
    const style = document.createElement('style');
    style.innerHTML = `${contentSelector} * {scroll-margin-bottom: calc(var(--hds-cc-height, -8px) + 8px);}`;
    document.head.appendChild(style);

    // Add spacer inside spacerParent (to the bottom of the page)
    const spacer = document.createElement('div');
    spacer.id = 'hds-cc__spacer';
    spacerParent.appendChild(spacer);
    spacer.style.height = 'var(--hds-cc-height, 0)';

    // Update spacer and scroll-margin-bottom on banner resize
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        document.documentElement.style.setProperty('--hds-cc-height', `${parseInt(entry.contentRect.height, 10) + parseInt(getComputedStyle(entry.target).borderTopWidth, 10)}px`);
        // spacer.style.height = `${entry.contentRect.height + parseInt(getComputedStyle(entry.target).borderTopWidth, 10)}px`;
      });
    });
    const bannerHeightElement = shadowRoot.querySelector('.hds-cc__container');
    resizeObserver.observe(bannerHeightElement);

    // Add button events
    const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
    const shadowRootForm = shadowRoot.querySelector('form');
    cookieButtons.forEach(button => button.addEventListener('click', e => {
      this.handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieSettings);
    }));

    // Add eventHandler for form
    this.controlForm(shadowRootForm);

    shadowRoot.querySelector('.hds-cc').focus();
  }

  // Add chat cookie functions to window
  async createChatConsentAPI() {
    const chatUserConsent = {

      retrieveUserConsent() {
        return this.isGroupAccepted('chat');
      },

      async confirmUserConsent() {
        const showBanner = true;

        // Check if our cookie exists
        try {
          const browserCookie = this.getCookie();

          let currentlyAccepted = [];

          if (browserCookie) {
            currentlyAccepted = Object.keys(browserCookie.groups);
          }

          const cookieSettings = await this.getCookieSettingsFromJsonFile();
          const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

          // Checksums for all groups calculated in parallel without waiting for each
          await Promise.all(cookieSettingsGroups.map(async (group) => {
            group.checksum = await this.getChecksum(group);
          }));

          this.saveAcceptedGroups(cookieSettings, [...currentlyAccepted, 'chat'], showBanner);
        } catch (err) {
          // If consent setting fails for some reason
          console.log('Consent failed.\n', err);
          return false;
        }

        // Doesn't handle the state where form is open but cookie doesn't exist
        // See controlForm-function for more information about this
        dispatchEvent(new CustomEvent('CONSENTS_CHANGED', { detail: { groups: ['chat'] } }));
      }
    };

    window.chat_user_consent = chatUserConsent;
  }

  async init() {

    const lang = window.hdsCookieConsentPageSettings.language;
    const cookieSettings = await this.getCookieSettings();

    if (window.hdsCookieConsentPageSettings.exposeChatFunctions) {
      this.createChatConsentAPI(); // Create chat consent functions
    }

    // If cookie settings have not changed, do not show banner, otherwise, check
    const shouldDisplayBanner = await this.shouldDisplayBanner(cookieSettings);
    if (shouldDisplayBanner) {
      await this.renderBanner(lang, cookieSettings);
    }
  };
}

window.hdsCookieConsents = new HDSCookieConsent();

// Debug helper. Open banner and run on console to see the box updated.
window.aaa_chatcheck = () => dispatchEvent(new CustomEvent('CONSENTS_CHANGED', { detail: { groups: ['chat'] } }));


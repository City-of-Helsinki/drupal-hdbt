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

class HdsCc {
  constructor() {
    this.COOKIE_NAME = '';
    this.COOKIE_DAYS = 100;
    this.UNCHANGED = 'unchanged';
    document.addEventListener('DOMContentLoaded', () => this.init());

    // Debug helper. Open banner and run on console to see the box updated.
    window.aaa_chatcheck = () => dispatchEvent(new CustomEvent('CONSENTS_CHANGED', { detail: { groups: ['chat'] } }));
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
  async readCookie() {
    let cookie;
    try {
      const cookieString = parse(document.cookie)[this.COOKIE_NAME];
      if (!cookieString) {
        console.log('Cookie is not set');
        return false;
      }
      cookie = JSON.parse(cookieString);
    } catch (err) {
      // If cookie parsing fails, show banner
      console.log(`Cookie parsing unsuccessful:\n${err}`);
      return false;
    }

    return cookie;
  }

  async setCookie(cookieData) {
    console.log('setCookie', cookieData);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.COOKIE_DAYS);
    document.cookie = serialize(this.COOKIE_NAME, JSON.stringify(cookieData), {expires: expiryDate});
  }

  async clearCookie() {
    console.log('clearCookie');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - this.COOKIE_DAYS);
    document.cookie = serialize(this.COOKIE_NAME, '', {expires: expiryDate});
  }

  saveAcceptedGroups(cookieSettings, acceptedGroupNames = [], showBanner = false) {
    console.log('Accepting cookies from groups:', acceptedGroupNames);

    const acceptedGroups = {};
    // Required should not come in every case; the category hash might have changed
    cookieSettings.requiredCookies.groups.forEach(group => {
      if (acceptedGroupNames.includes(group.groupId)) {
        acceptedGroups[group.groupId] = group.checksum;
      }
    });

    // Add accepted group names to acceptedGroups, assume others to be declined (overrides previous selections)
    cookieSettings.optionalCookies.groups.forEach(group => {
      if (acceptedGroupNames.includes(group.groupId)) {
        acceptedGroups[group.groupId] = group.checksum;
      }
    });

    this.setCookie({
      showBanner,
      checksum: cookieSettings.checksum,
      groups: acceptedGroups,
    });
  }

  async removeInvalidGroupsFromBrowserCookie(cookieSettingsGroups, browserCookieState, cookieSettings) {
    console.log('removeInvalidGroupsFromBrowserCookie', cookieSettingsGroups, browserCookieState, cookieSettings);

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
              console.log('Checksums do not match for group', cookieSettingsGroup.groupId);
            }
          }
        }
      });
    };

    console.log('newCookieGroups', newCookieGroups);

    if (newCookieGroups.length === 0) {
      console.log('No remaining groups found, erasing cookie');
      this.clearCookie();
    } else {
      // Because global checksum did not match, group checksums were checked and non-matching groups were removed, save the cleaned cookie
      const showBanner = true;
      this.saveAcceptedGroups(cookieSettings, newCookieGroups, showBanner);
    }

    return cookieSettings;
  }

  async getCookieSettings() {

    try {
      const cookieSettingsRaw = await fetch(window.hdsCookieConsentPageSettings.jsonUrl).then((response) => response.text());
      const cookieSettingsChecksum = await this.getChecksum(cookieSettingsRaw);

      const cookieSettings = JSON.parse(cookieSettingsRaw);
      this.COOKIE_NAME = cookieSettings.cookieName;

      // Compare file checksum with browser cookie checksum if the file has not changed and return false for no change (no banner needed)
      const browserCookie = await this.readCookie();
      // if (document.cookie && parse(document.cookie) && parse(document.cookie)[COOKIE_NAME]) {
      if (browserCookie) {
        try {
          // This means that browser cookie doesn't have 'showBanner' set true
          if (!browserCookie.showBanner && (cookieSettingsChecksum === browserCookie.checksum)) {
            console.log('This means that browser cookie doesn\'t have \'showBanner\' set true', browserCookie.showBanner);
            return this.UNCHANGED;
          }
        } catch (err) {
          console.log(`Parsing cookie json failed: ${err}`);
        }
      }

      cookieSettings.checksum = cookieSettingsChecksum;

      const essentialGroup = cookieSettings.requiredCookies.groups.find(group => group.groupId === 'essential');
      if (!essentialGroup) {
        // The site cookie settings must have required group named 'essential'
        throw new Error('Cookie consent error: essential group missing');
      }
      const requiredCookieFound = essentialGroup.cookies.find(cookie => cookie.name === this.COOKIE_NAME);
      if (!requiredCookieFound) {
        // The required group 'essential' must have cookie with name matching the root level 'cookieName'
        throw new Error('Cookie consent error: cookieName mismatch');
      }

      const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

      const cookieNames = [];
      cookieSettingsGroups.forEach(cookie => {
        if (cookieNames.includes(cookie.groupId)) {
          // The cookie settings must not contain cookie groups that have identical names
          throw new Error('Cookie consent error: group name collision');
        }
        cookieNames.push(cookie.groupId);
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const group of cookieSettingsGroups) {
        // eslint-disable-next-line no-await-in-loop
        const groupChecksum = await this.getChecksum(group);
        group.checksum = groupChecksum;
      }

      return await this.removeInvalidGroupsFromBrowserCookie(cookieSettingsGroups, browserCookie, cookieSettings);

    } catch (err) {
      if (err.message.includes('undefined')) {
        throw new Error('Cookie settings not found');
      }

      throw new Error(err.message);
    }
  }

  /**
   * Go through form and get accepted groups. Return a list of group ID's.
   */
  readGroupSelections(form, all = false) {
    const groupSelections = [];
    const formCheckboxes = form.querySelectorAll('input');
    formCheckboxes.forEach(check => {
      if(check.checked || all) {
        groupSelections.push(check.dataset.group);
      }
    });

    return groupSelections;
  }

  handleButtonEvents(selection, formReference, cookieSettings) {
    switch (selection) {
      case 'required': {
        const acceptedGroups = ['essential'];
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'all': {
        const acceptedGroups = this.readGroupSelections(formReference, true);
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      case 'selected': {
        const acceptedGroups = this.readGroupSelections(formReference);
        this.saveAcceptedGroups(cookieSettings, acceptedGroups);
        break;
      }
      default:
        // We should not be here, better do nothing
        break;
    }
    window.location.reload();
  }

  /**
   * Go through cookie group object and check if it has
   * property with given key
   */
  isGroupAccepted(groupName) {
    let browserCookieState = null;
    // Check if our cookie exists
    try {
      browserCookieState = JSON.parse(parse(document.cookie)[this.COOKIE_NAME]);
    } catch (err) {
      // If cookie parsing fails, show banner
      console.log('group accepted parse failure');
      return false;
    }

    // If the cookie group is accepted, the cookie group object contains
    // property with such key
    return !!browserCookieState.groups[groupName];
  }

  /**
   * logic for cookie banner spawn
   *   compare cookieSettings and browser cookie state
   *   check 1. if cookie exists 2. essentials approved 3. hash match - show banner
   *   else show banner
   */
  async checkBannerNeed(cookieSettings) {
    // Check if cookie has been set to show banner
    let cookieWantsToShow = false;
    try {
      const browserCookieState = await this.readCookie();
      cookieWantsToShow = browserCookieState.showBanner;
      if (cookieWantsToShow) {
        return true;
      }
    } catch (err) {
      // If cookie parsing fails, show banner
      console.log('Cookie doesn\'t exist');
      return true;
    }
    const essentialsApproved = this.isGroupAccepted('essential');

    const cookieSettingsUnchanged = cookieSettings === this.UNCHANGED;
    if (cookieSettingsUnchanged && essentialsApproved) {
      return false;
    }

    return true;
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
  translate(translationObj, lang) {
    if (typeof (translationObj) === 'object') {
      if (translationObj[lang] === undefined) {
        return translationObj.en; // fallback to English translation
      }
      return translationObj[lang];
    }
    return translationObj;
  }

  /**
   * Builder template functions
   *
   * - group
   * - tableRows
   */

  buildTableRows(cookies, lang) {
    let tableRows = '';

    cookies.forEach(cookie => {
      tableRows += getTableRowHtml(
        {
          name: this.translate(cookie.name, lang),
          host: this.translate(cookie.host, lang),
          description: this.translate(cookie.description, lang),
          expiration: this.translate(cookie.expiration, lang),
          type: this.translate(cookie.type, lang),
        }
      );
    });

    return tableRows;
  }

  getCookieGroupsHtml(cookieGroupList, lang, translations, groupRequired, groupName, acceptedGroups) {
    let groupsHtml = '';
    let groupNumber = 0;
    cookieGroupList.forEach(cookieGroup => {
      const title = this.translate(cookieGroup.title, lang);
      const description = this.translate(cookieGroup.description, lang);
      const {groupId} = cookieGroup;
      const tableRowsHtml = this.buildTableRows(cookieGroup.cookies, lang);
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

  async createShadowRoot(lang, cookieSettings) {
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
      // eslint-disable-next-line no-console
      console.error('Failed to load the CSS file:', error);
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
      browserCookie = await this.readCookie();
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
        let browserCookieState = null;
        // Check if our cookie exists
        try {
          try {
            browserCookieState = JSON.parse(parse(document.cookie)[this.COOKIE_NAME]);
          } catch (err) {
            // Doesn't handle the state where form is open but cookie doesn't exist
            console.log('no cookie:D');
          }

          // This is duplicate code from getCookieSettings
          // TODO: refactor the function return values, refactor showBanner logic
          const currentlyAccepted = Object.keys(browserCookieState.groups);
          const cookieSettingsRaw = await fetch(window.hdsCookieConsentPageSettings.jsonUrl).then((response) => response.text());
          const cookieSettingsChecksum = await this.getChecksum(cookieSettingsRaw);
          const cookieSettings = JSON.parse(cookieSettingsRaw);
          cookieSettings.checksum = cookieSettingsChecksum;
          const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

          // eslint-disable-next-line no-restricted-syntax
          for (const group of cookieSettingsGroups) {
            // eslint-disable-next-line no-await-in-loop
            const groupChecksum = await this.getChecksum(group);
            group.checksum = groupChecksum;
          }
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
    // If cookie settings can't be loaded, do not show banner
    let cookieSettings;
    try {
      cookieSettings = await this.getCookieSettings();
    } catch (err) {
      throw new Error(`Cookie settings not available, cookie banner won't render: \n${err}`);
    }

    if (window.hdsCookieConsentPageSettings.exposeChatFunctions) {
      this.createChatConsentAPI(); // Create chat consent functions
    }

    // TODO: consider naming
    // If cookie settings have not changed, do not show banner, otherwise, check
    const showBanner = await this.checkBannerNeed(cookieSettings);
    console.log('Create shadowroot?', showBanner);
    if (!showBanner) {
      // No need for banner, do not create shadowRoot
      return;
    }
    await this.createShadowRoot(lang, cookieSettings);
  };
}

// eslint-disable-next-line no-unused-vars
const hdsCc = new HdsCc();



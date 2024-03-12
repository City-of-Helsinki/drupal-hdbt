/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
/**
 * MEMO
 *
 * DONE fetch cookie settings from JSON
 *   get and refactor names etc.
 *   refactor filenames (hdsCookieConsentPageSettings -> pageCookieSettings etc.)
 *
 * DONE fetch page settings from inline JS
 *   language, jsonUrl
 *
 * DONE update helfi_cookies.json missing translations
 *
 * DONE eliminate global scope
 *
 * DONE set required cookies HTML to disabled and checked
 *   template changes
 *
 * logic for cookie banner spawn
 *   compare cookieSettings and browser cookie state
 *   check
 *   1. if cookie exists
 *   2. essentials approved
 *   3. group hashes match
 *   else show banner
 *
 * DONE cookie writing
 *   ONLY from one of buttons
 *   disallow chat elements until essentials are accepted (banner is closed)
 *
 * DONE cookie reading (from browser) logic refactor
 *   check categorically
 *
 * DONE plan how version handling happens
 *
 * build HTML with templates
 *   DONE properties and translations on place
 *   check ARIA-attributes
 *   check screenreader only texts
 *   add checkbox list
 *
 * check files for FIXME and TODO notes
 *
 * -------------------------------------------------
 * INCOMING FEATURES
 * -------------------------------------------------
 * monitor cookie- local- and sessionstorage
 *   create console error or some sentry log request
 *   should the unwanted cookie be removed?
 * handle revoked permission
 *   should remove unapproved cookies
 */

import { parse, serialize } from 'cookie/index';
import { getCookieBannerHtml, getGroupHtml, getTableRowHtml } from './template';
import { getTranslation, getTranslationKeys } from './hds-cc_translations';

const COOKIE_NAME = 'city-of-helsinki-cookie-consents';
const COOKIE_DAYS = 100;
const UNCHANGED = 'unchanged';

/**
 * Get checksum from string
 * @param {Sring} str to be hashed
 * @return {String} Hash in base16 from the string
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
async function getChecksum(message, length = 8) {
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
async function setCookie(cookieData) {
  console.log('setCookie', cookieData);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_DAYS);
  document.cookie = serialize(COOKIE_NAME, JSON.stringify(cookieData), {expires: expiryDate});
}

async function clearCookie() {
  console.log('clearCookie');
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - COOKIE_DAYS);
  document.cookie = serialize(COOKIE_NAME, '', {expires: expiryDate});
}

function saveAcceptedGroups(cookieSettings, acceptedGroupNames = [], showBanner = false) {
  console.log('Accepting cookies from groups:', acceptedGroupNames);

  const acceptedGroups = {};
  // Required come in every case
  cookieSettings.requiredCookies.groups.forEach(group => {
    acceptedGroups[group.commonGroup] = group.checksum;
  });

  // Add accepted group names to acceptedGroups, assume others to be declined (overrides previous selections)
  cookieSettings.optionalCookies.groups.forEach(group => {
    if (acceptedGroupNames.includes(group.commonGroup)) {
      acceptedGroups[group.commonGroup] = group.checksum;
    }
  });

  setCookie({
    show_banner: showBanner,
    checksum: cookieSettings.checksum,
    groups: acceptedGroups,
  });
}

async function removeInvalidGroupsFromBrowserCookie(cookieSettingsGroups, browserCookieState, cookieSettings) {
  console.log('removeInvalidGroupsFromBrowserCookie', cookieSettingsGroups, browserCookieState, cookieSettings);

  const newCookieGroups = [];

  // If browser cookie has groups
  if (browserCookieState.groups) {

    // Loop through groups in cookie settings
    cookieSettingsGroups.forEach(cookieSettingsGroup => {
      const browserGroupName = cookieSettingsGroup.commonGroup;
      const matchedBrowserGroup = browserCookieState.groups[browserGroupName];
      if (matchedBrowserGroup) {

        // If group names match
        if (browserGroupName === cookieSettingsGroup.commonGroup) {

          // If checksums match, add to new cookie groups
          if (browserCookieState.groups[browserGroupName] === cookieSettingsGroup.checksum) {
            newCookieGroups.push(cookieSettingsGroup.commonGroup);
          } else {
            console.log('Checksums do not match for group', cookieSettingsGroup.commonGroup);
          }
        }
      }
    });
  };

  console.log('newCookieGroups', newCookieGroups);

  if (newCookieGroups.length === 0) {
    console.log('No remaining groups found, erasing cookie');
    clearCookie();
  } else {
    // Because global checksum did not match, group checksums were checked and non-matching groups were removed, save the cleaned cookie
    const showBanner = true;
    saveAcceptedGroups(cookieSettings, newCookieGroups, showBanner);
  }


  return cookieSettings;
}

async function getCookieSettings() {

  try {
    const cookieSettingsRaw = await fetch(window.hdsCookieConsentPageSettings.jsonUrl).then((response) => response.text());
    const cookieSettingsChecksum = await getChecksum(cookieSettingsRaw);
    let browserCookieState = null;

    // Compare file checksum with browser cookie checksum if the file has not changed and return false for no change (no banner needed)
    if (document.cookie && parse(document.cookie) && parse(document.cookie)[COOKIE_NAME]) {
      try {
        browserCookieState = JSON.parse(parse(document.cookie)[COOKIE_NAME]);
        if (cookieSettingsChecksum === browserCookieState.checksum) {
          console.log('Cookie settings file has not changed, banner is not needed');
          return UNCHANGED;
        }
      } catch (err) {
        console.log(`Parsing cookie json failed: ${err}`);
      }
    }

    const cookieSettings = JSON.parse(cookieSettingsRaw);
    cookieSettings.checksum = cookieSettingsChecksum;

    // TODO: Check that cookieSettings contain the COOKIE_NAME cookie in them.
    const essentialFound = cookieSettings.requiredCookies.groups[0].cookies[1].name === COOKIE_NAME;
    if (essentialFound) {
      // TODO remove after refactor
      console.log('Site specific settins are valid');
    } else {
      throw new Error('Cookie settings invalid, check documentation');
    }

    const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

    // eslint-disable-next-line no-restricted-syntax
    for (const group of cookieSettingsGroups) {
      // eslint-disable-next-line no-await-in-loop
      const groupChecksum = await getChecksum(group);
      group.checksum = groupChecksum;
    }

    if (browserCookieState === null) {
      return cookieSettings;
    }

    return await removeInvalidGroupsFromBrowserCookie(cookieSettingsGroups, browserCookieState, cookieSettings);

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

function handleButtonEvents(selection, formReference, cookieSettings) {
  switch (selection) {
    case 'required': {
      const acceptedGroups = ['essential'];
      saveAcceptedGroups(cookieSettings, acceptedGroups);
      break;
    }
    case 'all': {
      const acceptedGroups = readGroupSelections(formReference, true);
      saveAcceptedGroups(cookieSettings, acceptedGroups);
      break;
    }
    case 'selected': {
      const acceptedGroups = readGroupSelections(formReference);
      saveAcceptedGroups(cookieSettings, acceptedGroups);
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
function isGroupAccepted(groupName) {
  let browserCookieState = null;
  // Check if our cookie exists
  try {
    browserCookieState = JSON.parse(parse(document.cookie)[COOKIE_NAME]);
  } catch (err) {
    // If cookie parsing fails, show banner
    return false;
  }

  // If the cookie group is accepted, the cookie group object contains
  // property with such key
  return !!browserCookieState.groups[groupName];
}

/**
 * logic for cookie banner spawn
 *   compare cookieSettings and browser cookie state
 *   check 1. if cookie exists 2. essentials approved 3. id list identicale - show banner
 *   else show banner
 */

// TODO: move wanted logic here
function checkBannerNeed() {
  // TODO: use also cookies show_banner to check if banner is needed
  const essentialsApproved = isGroupAccepted('essential');
  if (essentialsApproved) {
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
function translate(translationObj, lang) {
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

function buildTableRows(cookies, lang) {
  let tableRows = '';

  cookies.forEach(cookie => {
    tableRows += getTableRowHtml(
      {
        name: translate(cookie.name, lang),
        host: translate(cookie.host, lang),
        description: translate(cookie.description, lang),
        expiration: translate(cookie.expiration, lang),
        type: translate(cookie.type, lang),
      }
    );
  });

  return tableRows;
}

function getCookieGroupsHtml(cookieGroupList, lang, translations, groupRequired, groupName) {
  let groupsHtml = '';
  let groupNumber = 0;
  cookieGroupList.forEach(cookieGroup => {
    const title = translate(cookieGroup.title, lang);
    const description = translate(cookieGroup.description, lang);
    const groupId = cookieGroup.commonGroup;
    const tableRowsHtml = buildTableRows(cookieGroup.cookies, lang);
    groupsHtml += getGroupHtml({...translations, title, description }, groupId, `${groupName}_${groupNumber}`, tableRowsHtml, groupRequired);
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
 */
function controlForm(form) {
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

// Debug helper. Open banner and run on console to see the box updated.
window.aaa_chatcheck = () => dispatchEvent(new CustomEvent('CONSENTS_CHANGED', { detail: { groups: ['chat'] } }));

async function createShadowRoot(lang, cookieSettings) {

  const targetSelector = window.hdsCookieConsentPageSettings.targetSelector || 'body';
  const bannerTarget = document.querySelector(targetSelector);
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('hds-cc__target');
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

  let groupsHtml = '';
  groupsHtml += getCookieGroupsHtml(cookieSettings.requiredCookies.groups, lang, translations, true, 'required');
  groupsHtml += getCookieGroupsHtml(cookieSettings.optionalCookies.groups, lang, translations, false, 'optional');

  shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

  // Add button events
  const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
  const shadowRootForm = shadowRoot.querySelector('form');
  cookieButtons.forEach(button => button.addEventListener('click', e => {
    handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieSettings);
  }));

  // Add eventHandler for form
  controlForm(shadowRootForm);

  shadowRoot.querySelector('.hds-cc').focus();
}

// Add chat cookie functions to window
async function createChatConsentAPI() {
  const chatUserConsent = {
    retrieveUserConsent() {
      return isGroupAccepted('chat');
    },
    async confirmUserConsent() {
      const showBanner = true;
      let browserCookieState = null;
      // Check if our cookie exists
      try {
        try {
          browserCookieState = JSON.parse(parse(document.cookie)[COOKIE_NAME]);
        } catch (err) {
          // Doesn't handle the state where form is open but cookie doesn't exist
          console.log('no cookie:D');
        }

        // This is duplicate code from getCookieSettings
        // TODO: refactor the function return values, refactor showBanner logic
        const currentlyAccepted = Object.keys(browserCookieState.groups);
        const cookieSettingsRaw = await fetch(window.hdsCookieConsentPageSettings.jsonUrl).then((response) => response.text());
        const cookieSettingsChecksum = await getChecksum(cookieSettingsRaw);
        const cookieSettings = JSON.parse(cookieSettingsRaw);
        cookieSettings.checksum = cookieSettingsChecksum;
        const cookieSettingsGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

        // eslint-disable-next-line no-restricted-syntax
        for (const group of cookieSettingsGroups) {
          // eslint-disable-next-line no-await-in-loop
          const groupChecksum = await getChecksum(group);
          group.checksum = groupChecksum;
        }
        saveAcceptedGroups(cookieSettings, [...currentlyAccepted, 'chat'], showBanner);
      } catch (err) {
        // If consent setting fails for some reason
        console.log('Consent failed.\n', err);
        return false;
      }

      // Doesn't handle the state where form is open but cookie doesn't exist
      dispatchEvent(new CustomEvent('CONSENTS_CHANGED', { detail: { groups: ['chat'] } }));
    }
  };

  window.chat_user_consent = chatUserConsent;
}

const init = async () => {
  const lang = window.hdsCookieConsentPageSettings.language;

  // If cookie settings can't be loaded, do not show banner
  let cookieSettings;
  try {
    cookieSettings = await getCookieSettings();
  } catch (err) {
    throw new Error('Cookie settings not available, cookie banner won\'t render', err);
  }

  if (window.hdsCookieConsentPageSettings.exposeChatFunctions) {
    createChatConsentAPI(); // Create chat consent functions
  }

  // TODO: consider naming
  // If cookie settings have not changed, do not show banner, otherwise, check
  const showBanner = (cookieSettings === UNCHANGED) ? false : checkBannerNeed(cookieSettings);
  if (!showBanner) {
    console.log('Cookies are handled, showing banner for development');
    return;
  }
  await createShadowRoot(lang, cookieSettings);
};

document.addEventListener('DOMContentLoaded', () => init());

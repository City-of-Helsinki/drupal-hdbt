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
const COOKIE_GROUP_NAME = 'city-of-helsinki-cookie-agreed-groups';

/**
 * Get checksum from string
 * @param {Sring} str to be hashed
 * @return {String} Hash in base16 from the string
 */
function getChecksum(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Return list of cookie ID's belonging to given groups
 */
function getCookieIdsInGroup(cookieSettings, groups = ['essential']) {
  const foundCookies = [];

  // Merge required and optional cookies
  const allGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

  // Find id's
  groups.forEach(() => {
    allGroups.forEach(group => {
      if (groups.includes(group.commonGroup)) {
        group.cookies.forEach(cookie => {
          foundCookies.push(cookie.id);
        });
      }
    });
  });

  return foundCookies;
}

/**
 * Cookie section
 */
function setCookies(cookieList, acceptedGroups, cookieSettings)  {
  document.cookie = serialize(COOKIE_NAME, JSON.stringify(cookieList));

  // Create checksum for accepted groups for quick comparison for cookie id changes
  const groupChecksums = {};
  acceptedGroups.forEach(group => {
    const cookieIds = getCookieIdsInGroup(cookieSettings, [group]);;
    groupChecksums[group] = getChecksum(cookieIds.join(','));
  });

  document.cookie = serialize(COOKIE_GROUP_NAME, JSON.stringify(groupChecksums));
}

async function getCookieSettings() {
  try {
    const cookieSettings = await fetch(window.hdsCookieConsentPageSettings.jsonUrl).then((response) => response.json());
    const essentialFound = cookieSettings.requiredCookies.groups[0].cookies[1].name === COOKIE_NAME;
    if (essentialFound) {
      // TODO remove after refactor
      console.log('Site specific settins are valid');
    } else {
      throw new Error('Cookie settings invalid, check documentation');
    }
    return cookieSettings;
  } catch (err) {
    if (err.message.includes('undefined')) {
      throw new Error('Cookie settings not found');
    }

    throw new Error(err.message);
  }
}

/**
 * Turn list of allowed ID's into key-value pairs suitable for
 * cookie serialization
 */
function formatCookieList(cookieSettings, acceptedCookieIds = [], acceptedGroups = []) {
  console.log('Accepting cookies from groups:', acceptedGroups);
  const formattedListing = {};
  // Required come in every case
  cookieSettings.requiredCookies.groups.forEach(group => {
    group.cookies.forEach(cookie => {
      formattedListing[cookie.id] = true;
    });
  });

  // Accepted ID's get value 'true', others get 'false'
  cookieSettings.optionalCookies.groups.forEach(group => {
    group.cookies.forEach(cookie => {
      formattedListing[cookie.id] = acceptedCookieIds.includes(cookie.id) ?? false;
    });
  });

  setCookies(formattedListing, acceptedGroups, cookieSettings);
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
      const acceptedCookies = getCookieIdsInGroup(cookieSettings, acceptedGroups);
      formatCookieList(cookieSettings, acceptedCookies, acceptedGroups);
      break;
    }
    case 'all': {
      const acceptedGroups = readGroupSelections(formReference, true);
      const acceptedCookies = getCookieIdsInGroup(cookieSettings, acceptedGroups);
      formatCookieList(cookieSettings, acceptedCookies, acceptedGroups);
      break;
    }
    case 'selected': {
      const acceptedGroups = readGroupSelections(formReference);
      const acceptedCookies = getCookieIdsInGroup(cookieSettings, acceptedGroups);
      formatCookieList(cookieSettings, acceptedCookies, acceptedGroups);
      break;
    }
    default:
      // We should not be here, better do nothing
      break;
  }
}

/**
 * Go through cookieSettings and figure out which cookies belong to
 * given group, see if they are all set 'true' in browser
 * and then return boolean
 */
function isGroupAccepted(cookieSettings, group) {
  // Increment after ID has it's matching cookie set as true.
  let consentGivenCount = 0;
  let browserCookieState = null;
  // Check if our cookie exists
  try {
    browserCookieState = JSON.parse(parse(document.cookie)[COOKIE_NAME]);
  } catch (err) {
    // If cookie parsing fails, show banner
    return false;
  }
  const ids = getCookieIdsInGroup(cookieSettings, [group]);
  // Compare state and ids
  // TODO: optimize looping
  ids.forEach(id => {
    Object.entries(browserCookieState).forEach(cookie => {
      if(cookie[0] === id && cookie[1] === true) {
        consentGivenCount += 1;
        return;
      };
    });
  });

  return ids.length === consentGivenCount;
}

/**
 * logic for cookie banner spawn
 *   compare cookieSettings and browser cookie state
 *   check 1. if cookie exists 2. essentials approved 3. id list identicale - show banner
 *   else show banner
 */

function checkBannerNeed(cookieSettings) {
  const essentialsApproved = isGroupAccepted(cookieSettings, 'essential');
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

function cookieGroups(cookieGroupList, lang, translations, groupRequired, groupName) {
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
  groupsHtml += cookieGroups(cookieSettings.requiredCookies.groups, lang, translations, true, 'required');
  groupsHtml += cookieGroups(cookieSettings.optionalCookies.groups, lang, translations, false, 'optional');

  shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

  // Add button events
  const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
  cookieButtons.forEach(button => button.addEventListener('click', e => {
    const shadowRootForm = e.target.closest('#hds-cc').querySelector('form');
    handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieSettings);
  }));

  shadowRoot.querySelector('.hds-cc').focus();
}

// Add chat cookie functions to window
function createChatConsentAPI(cookieSettings) {
  const chatUserConsent = {
    // TODO: both of these are dependent on groups array, should use ID list instead
    retrieveUserConsent() {
      return isGroupAccepted(cookieSettings, 'chat');
    },
    confirmUserConsent() {
      // TODO accept chat
      const acceptedCookies = getCookieIdsInGroup(cookieSettings, ['chat']);
      formatCookieList(cookieSettings, acceptedCookies, ['chat']);
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
    throw new Error('Cookie settings not available, cookie banner won\'t render');
  }

  // Create chat consent functions
  createChatConsentAPI(cookieSettings);

  // TODO: consider naming
  const showBanner = checkBannerNeed(cookieSettings);
  if (!showBanner) {
    console.log('Cookies are handled, showing banner for development');
    // TODO: uncomment return statement
    // return;
  }

  await createShadowRoot(lang, cookieSettings);
};

document.addEventListener('DOMContentLoaded', () => init());

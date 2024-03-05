/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
/**
 * MEMO
 *
 * fetch cookie settings from JSON
 *   get and refactor names etc.
 *   refactor filenames (hdsCcSettings -> pageCookieSettings etc.)
 *
 * fetch page settings from inline JS
 *   language, jsonUrl
 *
 * DONE update helfi_cookies.json missing translations
 *
 * eliminate global scope
 *
 * DONE set required cookies HTML to disabled and checked
 *   template changes
 *
 * logic for cookie banner spawn
 *   compare cookieSettings and browser cookie state
 *   check 1. if cookie exists 2. essentials approved 3. id list identicale - show banner
 *   else show banner
 *
 * cookie writing
 *   ONLY from one of buttons
 *   disallow chat elements until essentials are accepted (banner is closed)
 *
 * cookie reading (from browser) logic refactor
 *   check categorically
 *
 * plan how version handling happens
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

/**
 * Cookie is structured like this:
 *
 * cookieState = {
 *   'cookie-agreed-categories': [], // list of accepted categories ['essential']
 *   'city-of-helsinki-cookie-consents': {} // object of key-value pairs: { 'cookieid1': true, 'cookieid2': true}
 * };
 */


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
 * Return list of cookie ID's belonging to given categories
 */
function getCookieIdsInCategory(cookieSettings, categories = ['essential']) {
  const foundCookies = [];

  // Merge required and optional cookies
  const allGroups = [...cookieSettings.requiredCookies.groups, ...cookieSettings.optionalCookies.groups];

  // Find id's
  categories.forEach(() => {
    allGroups.forEach(group => {
      if (categories.includes(group.commonGroup)) {
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
function setCookies(cookieList, acceptedCategories, cookieSettings)  {
  document.cookie = serialize('city-of-helsinki-cookie-consents', JSON.stringify(cookieList));

  // Create checksum for accepted categories for quick comparison for cookie id changes
  const categoryChecksums = {};
  acceptedCategories.forEach(category => {
    const cookieIds = getCookieIdsInCategory(cookieSettings, [category]);;
    categoryChecksums[category] = getChecksum(cookieIds.join(','));
  });

  document.cookie = serialize('DEBUG-cookie-agreed-categories', JSON.stringify(categoryChecksums));
}

async function getCookieSettings() {
  // TODO: Add error handling for missing settings and wrong url
  try {
    const cookieSettings = await fetch(window.hdsCcSettings.jsonUrl).then((response) => response.json());
    return cookieSettings;
  } catch (err) {
    if (err.message.includes('undefined')) {
      console.log('Cookie settings not found');
    }
    if (err.message.includes('Failed to fetch')) {
      console.log(err.message, 'failure');
    }
    return false;
  }
}

/**
 * Turn list of allowed ID's into key-value pairs suitable for
 * cookie serialization
 */
function formatCookieList(cookieSettings, acceptedCookieIds = [], acceptedCategories = []) {
  console.log('Accepting cookies from categories:', acceptedCategories);
  const formattedListing = {};
  // Required come in every case
  cookieSettings.requiredCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      formattedListing[cookie.id] = true;
    });
  });

  // Accepted ID's get value 'true', others get 'false'
  cookieSettings.optionalCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      formattedListing[cookie.id] = acceptedCookieIds.includes(cookie.id) ?? false;
    });
  });

  setCookies(formattedListing, acceptedCategories, cookieSettings);
}

/**
 * Go through form and get accepted categories. Return a list of group ID's.
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
      const acceptedCategories = ['essential'];
      const acceptedCookies = getCookieIdsInCategory(cookieSettings, acceptedCategories);
      formatCookieList(cookieSettings, acceptedCookies, acceptedCategories);
      break;
    }
    case 'all': {
      const acceptedCategories = readGroupSelections(formReference, true);
      const acceptedCookies = getCookieIdsInCategory(cookieSettings, acceptedCategories);
      formatCookieList(cookieSettings, acceptedCookies, acceptedCategories);
      break;
    }
    case 'selected': {
      const acceptedCategories = readGroupSelections(formReference);
      const acceptedCookies = getCookieIdsInCategory(cookieSettings, acceptedCategories);
      formatCookieList(cookieSettings, acceptedCookies, acceptedCategories);
      break;
    }
    default:
      // We should not be here, better do nothing
      break;
  }
}

/**
 * Go through cookieSettings and figure out which cookies belong to
 * given category, see if they are all set 'true' in browser
 * and then return boolean
 */
function isCategoryAccepted(cookieSettings, category) {
  // Increment after ID has it's matching cookie set as true.
  let consentGivenCount = 0;
  let browserCookieState = null;
  // Check if our cookie exists
  try {
    browserCookieState = JSON.parse(parse(document.cookie)['city-of-helsinki-cookie-consents']);
  } catch (err) {
    // If cookie parsing fails, show banner
    return false;
  }
  const ids = getCookieIdsInCategory(cookieSettings, [category]);
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
  const essentialsApproved = isCategoryAccepted(cookieSettings, 'essential');
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

function cookieGroups(cookieGroupList, lang, translations, groupRequired = false) {
  let groupsHtml = '';
  cookieGroupList.forEach(cookieGroup => {
    const title = translate(cookieGroup.title, lang);
    const description = translate(cookieGroup.description, lang);
    const groupId = cookieGroup.commonGroup;
    const tableRowsHtml = buildTableRows(cookieGroup.cookies, lang);
    groupsHtml += getGroupHtml({...translations, title, description }, groupId, tableRowsHtml, groupRequired);
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

  const targetSelector = window.hdsCcSettings.targetSelector || 'body';
  const bannerTarget = document.querySelector(targetSelector);
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('hds-cc__target');
  bannerTarget.prepend(bannerContainer);
  const shadowRoot = bannerContainer.attachShadow({ mode: 'open' });

  // Fetch the external CSS file
  try {
    const response = await fetch(window.hdsCcSettings.tempCssPath);
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
    // TODO: consider the following
    translations[key] = getTranslation(key, lang, cookieSettings);
  });

  let groupsHtml = '';
  groupsHtml += cookieGroups(cookieSettings.requiredCookies.groups, lang, translations, true);
  groupsHtml += cookieGroups(cookieSettings.optionalCookies.groups, lang, translations, false);

  shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

  // Add button events
  const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
  cookieButtons.forEach(button => button.addEventListener('click', e => {
    const shadowRootForm = e.target.closest('#hds-cc').querySelector('form');
    handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieSettings);
  }));

  shadowRoot.querySelector('.hds-cc').focus();
}

// TODO: Remove this
// Debug helper key bindings
function createDebugEvents(cookieSettings) {
  console.log('Hotkeys: left promt, right list cookies');
  // Check if selected category is allowed
  window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
      // eslint-disable-next-line no-alert
      const cat = prompt('Which category to check?\n1 = Preferences\n2 = Statistics\n3 = chat\n4 = essentials');
      const options = {
        1: 'preferences',
        2: 'statistics',
        3: 'chat'
      };
      console.log(`Category ${options[cat]} allowed: `, isCategoryAccepted(cookieSettings, options[cat]));
    }
  // Check cookielisting
    if (e.code === 'ArrowRight') {
      const browserCookieState = parse(document.cookie);
      console.log('Currently accepted categories:', JSON.parse(browserCookieState['DEBUG-cookie-agreed-categories']));

      console.log('Currently accepted cookies:');
      const noCurly = /{|}/gi;
      console.log(browserCookieState['city-of-helsinki-cookie-consents'].replaceAll(noCurly, '').replaceAll(',', '\n'));
    }
  });
}

// Add chat cookie functions to window
function createChatConsentAPI(cookieSettings) {
  const chatUserConsent = {
    // TODO: both of these are dependent on categories array, should use ID list instead
    retrieveUserConsent() {
      return isCategoryAccepted(cookieSettings, 'chat');
    },
    confirmUserConsent() {
      // Add chat cookies to allowed id list
      // cookieState['cookie-agreed-categories'].push('chat');
      // getCookieIdsInCategory(cookieState['cookie-agreed-categories']);
    }
  };

  window.chat_user_consent = chatUserConsent;
}

const init = async () => {
  const lang = window.hdsCcSettings.language;

  // If cookie settings can't be loaded, do not show banner
  const cookieSettings = await getCookieSettings();
  if (cookieSettings === false) {
    throw new Error('Cookie settings not available');
  }

  // Create chat consent functions
  createChatConsentAPI(cookieSettings);

  // Debug hotkeys
  createDebugEvents(cookieSettings);

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
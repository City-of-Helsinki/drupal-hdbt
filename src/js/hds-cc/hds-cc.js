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
 * Cookie section
 */
function setCookies(cookieList, categoryList) {
  document.cookie = serialize('city-of-helsinki-cookie-consents', JSON.stringify(cookieList));
  // document.cookie = serialize('cookie-agreed-categories', JSON.stringify(categoryList));
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
function formatCookieList(cookieData, acceptedCookieIds = []) {
  const formattedListing = {};
  // Required come in every case
  cookieData.requiredCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      formattedListing[cookie.id] = true;
    });
  });

  // Accepted ID's get value 'true', others get 'false'
  cookieData.optionalCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      formattedListing[cookie.id] = acceptedCookieIds.includes(cookie.id) ?? false;
    });
  });

  setCookies(formattedListing);
}

/**
 * Return list of cookie ID's belonging to given categories
 */
function findCategoryCookieIds(cookieData, categories = ['essential']) {
  const foundCookies = [];

  // Merge required and optional cookies
  const allGroups = [...cookieData.requiredCookies.groups, ...cookieData.optionalCookies.groups];

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

function handleButtonEvents(selection, formReference, cookieData) {
  switch (selection) {
    case 'required': {
      const acceptedCookies = findCategoryCookieIds(cookieData, ['essential']);
      formatCookieList(cookieData, acceptedCookies);
      break;
    }
    case 'all': {
      const acceptedCategories = readGroupSelections(formReference, true);
      const acceptedCookies = findCategoryCookieIds(cookieData, acceptedCategories);
      formatCookieList(cookieData, acceptedCookies);
      break;
    }
    case 'selected': {
      const acceptedCategories = readGroupSelections(formReference);
      const acceptedCookies = findCategoryCookieIds(cookieData, acceptedCategories);
      formatCookieList(cookieData, acceptedCookies);
      break;
    }
    default:
      // We should not be here, better do nothing
      break;
  }
}

/**
 * Go through cookieData and figure out which cookies belong to
 * given category, see if they are all set 'true' in browser
 * and then return boolean
 */
function userHasGivenConsent(cookieData, category) {
  // Increment after ID has it's matching cookie set as true.
  let consentGivenCount = 0;
  const browserCookieState = JSON.parse(parse(document.cookie)['city-of-helsinki-cookie-consents']);
  const ids = findCategoryCookieIds(cookieData, [category]);
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

function checkBannerNeed(cookieData) {
  const essentialsApproved = userHasGivenConsent(cookieData, 'essential');
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
async function createShadowRoot(lang, cookieData) {

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
    translations[key] = getTranslation(key, lang, cookieData);
  });

  let groupsHtml = '';
  groupsHtml += cookieGroups(cookieData.requiredCookies.groups, lang, translations, true);
  groupsHtml += cookieGroups(cookieData.optionalCookies.groups, lang, translations, false);

  shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

  // Add button events
  const cookieButtons = shadowRoot.querySelectorAll('button[type=submit]');
  cookieButtons.forEach(button => button.addEventListener('click', e => {
    const shadowRootForm = e.target.closest('#hds-cc').querySelector('form');
    handleButtonEvents(e.target.dataset.approved, shadowRootForm, cookieData);
  }));

  shadowRoot.querySelector('.hds-cc').focus();
}

// TODO: Remove this
// Debug helper key bindings
function createDebugEvents(cookieData) {
  console.log('Hotkeys: left and right arrows');
  // Check if selected category is allowed
  window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
      const cat = prompt('Which category to check?\n1 = Preferences\n2 = Statistics\n3 = chat\n4 = essentials');
      const options = {
        1: 'preferences',
        2: 'statistics',
        3: 'chat'
      };
      console.log(`Category ${options[cat]} allowed: `, userHasGivenConsent(cookieData, options[cat]));
    }
  // Check cookielisting
    if (e.code === 'ArrowRight') {
      console.log('Currently accepted cookies:');
      const browserCookieState = parse(document.cookie);
      const noCurly = /{|}/gi;
      console.log(browserCookieState['city-of-helsinki-cookie-consents'].replaceAll(noCurly, '').replaceAll(',', '\n'));
    }
  });
}

// Add chat cookie functions to window
function createChatConsentAPI(cookieData) {
  const chatUserConsent = {
    // TODO: both of these are dependent on categories array, should use ID list instead
    retrieveUserConsent() {
      return userHasGivenConsent(cookieData, 'chat');
    },
    confirmUserConsent() {
      // Add chat cookies to allowed id list
      // cookieState['cookie-agreed-categories'].push('chat');
      // findCategoryCookieIds(cookieState['cookie-agreed-categories']);
    }
  };

  window.chat_user_consent = chatUserConsent;
}

const init = async () => {
  const lang = window.hdsCcSettings.language;

  // If cookie settings can't be loaded, do not show banner
  const cookieData = await getCookieSettings();
  if (cookieData === false) {
    console.log('Cookie settings not available');
    return;
  }

  // Create chat consent functions
  createChatConsentAPI(cookieData);

  // Debug hotkeys
  createDebugEvents(cookieData);

  // TODO: consider naming
  const showBanner = checkBannerNeed(cookieData);
  if (!showBanner) {
    console.log('Cookies are handled, showing banner for development');
    // TODO: uncomment return statement
    // return;
  }

  await createShadowRoot(lang, cookieData);
};

document.addEventListener('DOMContentLoaded', () => init());

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

const cookieState = {
  'cookie-agreed-categories': [], // list of accepted categories ['essential']
  'city-of-helsinki-cookie-consents': {} // object of key-value pairs: { 'cookieid1': true, 'cookieid2': true}
};

/**
 * Cookie section
 */
function setCookies() {
  document.cookie = serialize('city-of-helsinki-cookie-consents', JSON.stringify(cookieState['city-of-helsinki-cookie-consents']));
  document.cookie = serialize('cookie-agreed-categories', JSON.stringify(cookieState['cookie-agreed-categories']));
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

function userHasGivenConsent(category) {
  const browserCookieState = parse(document.cookie);
  if (browserCookieState['cookie-agreed-categories'] === undefined) return false;
  return browserCookieState['cookie-agreed-categories'].includes(category);
}

function resetCookieState() {
  // reset cookie state
  window.cookieData.requiredCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      cookieState['city-of-helsinki-cookie-consents'][cookie.id] = false;
    });
  });
  window.cookieData.optionalCookies.groups.forEach(category => {
    category.cookies.forEach(cookie => {
      cookieState['city-of-helsinki-cookie-consents'][cookie.id] = false;
    });
  });
}

function listCategoryCookies(categories = []) {
  if (categories.length === 0) {
    resetCookieState();
    setCookies();
    return;
  }
  const acceptedCookies = [];

  // Handle required cookies
  if (categories.includes('essential')) {
    window.cookieData.requiredCookies.groups.forEach(group => {
      group.cookies.forEach(cookie => {
        acceptedCookies.push(cookie.id);
      });
    });
  }

  // Handle optional cookies
  categories.forEach(() => {
    window.cookieData.optionalCookies.groups.forEach(group => {
      if (categories.includes(group.commonGroup)) {
        group.cookies.forEach(cookie => {
          acceptedCookies.push(cookie.id);
        });
      }
    });
  });

  resetCookieState();
  acceptedCookies.forEach(cookie => {
    cookieState['city-of-helsinki-cookie-consents'][cookie] = true;
  });

  setCookies();
}

function updateCookieConsents() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  const acceptedCategories = [];
  checkboxes.forEach(box => {
    if (box.checked) {
      acceptedCategories.push(box.id.replaceAll('-cookies', ''));
    }
  });

  const stateCategories = cookieState['cookie-agreed-categories'];
  stateCategories.splice(0, stateCategories.length, ...acceptedCategories);
  listCategoryCookies(acceptedCategories);
}

/**
 * logic for cookie banner spawn
 *   compare cookieSettings and browser cookie state
 *   check 1. if cookie exists 2. essentials approved 3. id list identicale - show banner
 *   else show banner
 */

function checkBannerNeed() {
  const essentialsApproved = userHasGivenConsent('essential');
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
// Add chat cookie functions to window
const chatUserConsent = {
  retrieveUserConsent() {
    return userHasGivenConsent('chat');
  },
  confirmUserConsent() {
    cookieState['cookie-agreed-categories'].push('chat');
    listCategoryCookies(cookieState['cookie-agreed-categories']);
  }
};

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

  shadowRoot.querySelector('.hds-cc').focus();
}

const init = async () => {
  const lang = window.hdsCcSettings.language;
  window.chat_user_consent = chatUserConsent;

  // TODO: consider naming
  const showBanner = checkBannerNeed();
  if (!showBanner) {
    console.log('cookies handled');
    return;
  }

  // If cookie settings can't be loaded, do not show banner
  const cookieData = await getCookieSettings();
  if (cookieData === false) {
    console.log('Cookie settings not available');
    return;
  }
  // TODO: consider the need of scoping
  window.cookieData = cookieData;

  resetCookieState();

  await createShadowRoot(lang, cookieData);
  // const lists = document.querySelector('.hds-cc__target').shadowRoot.getElementById('lists');
};

document.addEventListener('DOMContentLoaded', () => init());

// TODO: Remove this
// Debug helper key bindings
window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    setCookies();
  }
  if (e.code === 'ArrowUp') {
    updateCookieConsents();
  }
  if (e.code === 'ArrowDown') {
    resetCookieState();
  }
});

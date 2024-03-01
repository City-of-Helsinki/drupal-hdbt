import { parse, serialize } from 'cookie/index';
import { getCookieBannerHtml, getGroupHtml, getTableRowHtml } from './template';
import { getTranslation, getTranslationKeys } from './hds-cc_translations';

const cookieState = {
  'cookie-agreed-categories': [], // list of accepted categories ['essential']
  'city-of-helsinki-cookie-consents': {} // object of key-value pairs: { 'cookieid1': true, 'cookieid2': true}
};

function setCookies() {
  document.cookie = serialize('city-of-helsinki-cookie-consents', JSON.stringify(cookieState['city-of-helsinki-cookie-consents']));
  document.cookie = serialize('cookie-agreed-categories', JSON.stringify(cookieState['cookie-agreed-categories']));
}

async function getCookieData() {
  // TODO: Add error handling for missing settings and wrong url
  return (await fetch(window.hdsCcSettings.jsonUrl)).json();
}

function getCookieTranslation(field, lang) {
  if (typeof(field) === 'object') {
      if (field[lang] === undefined) {
          // fallback to English translation
          return field.en;
      }
      return field[lang];
  }

  return field;
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
        name: getCookieTranslation(cookie.name, lang),
        host: getCookieTranslation(cookie.host, lang),
        description: getCookieTranslation(cookie.description, lang),
        expiration: getCookieTranslation(cookie.expiration, lang),
        type: getCookieTranslation(cookie.type, lang),
      }
    );
  });

  return tableRows;
}

function cookiesGroups(cookieGroupList, lang, translations, groupRequired) {
  let groupsHtml = '';
  cookieGroupList.forEach(cookieGroup => {
    const groupId = cookieGroup.commonGroup;
    const tableRowsHtml = buildTableRows(cookieGroup.cookies, lang);
    groupsHtml += getGroupHtml(translations, groupId, tableRowsHtml);
  });
  return groupsHtml;
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
  groupsHtml += cookiesGroups(cookieData.requiredCookies.groups, lang, translations, true);
  groupsHtml += cookiesGroups(cookieData.optionalCookies.groups, lang, translations, false);

  shadowRoot.innerHTML += getCookieBannerHtml(translations, groupsHtml);

  shadowRoot.querySelector('.hds-cc').focus();
}

const init = async () => {
  const lang = window.hdsCcSettings.language;
  window.chat_user_consent = chatUserConsent;

  const cookieData = await getCookieData();
  // TODO: consider the need of scoping
  window.cookieData = cookieData;

  resetCookieState();

  await createShadowRoot(lang, cookieData);
  // const lists = document.querySelector('.hds-cc__target').shadowRoot.getElementById('lists');
};

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

document.addEventListener('DOMContentLoaded', () => init());
// Debug helper key bindings
window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    setCookies();
  }
  if (e.code === 'ArrowUp') {
    updateCookieConsents();
  }
});

import { parse, serialize } from 'cookie/index';
import { getCookieBannerHTML, getGroupHtml } from './template';
import { getTranslation, getTranslationKeys } from './hds-cc_translations';

const templateContents = {
  translations: {},
  groups: ''
};

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
 * - table
 * - rows
 */

function buildRow(cookie, lang) {
  // TODO: move to template file
return `<tr>
  <td>${cookie.name}</td>
  <td>${cookie.host}</td>
  <td>${getCookieTranslation(cookie.description, lang)}</td>
  <td>${getCookieTranslation(cookie.expiration, lang)}</td>
  <td>${getCookieTranslation(cookie.type, lang)}</td>
</tr>`;
}

function buildTable(cookies, lang) {
  let rows = '';

    cookies.forEach(cookie => {
      rows += buildRow(cookie, lang);
    });

    return rows;
}

function buildGroup(cookieGroup, lang) {
  const table = buildTable(cookieGroup.cookies, lang);
  const groupContent = {
    table,
    groupId: cookieGroup.commonGroup,
    translations: templateContents.translations
  };
  const groupHtml = getGroupHtml(groupContent);
  templateContents.groups += groupHtml;
}

function requiredCookiesGroups(cookieGroupList, lang) {
  cookieGroupList.forEach(cookieGroup => {
    buildGroup(cookieGroup, lang);
  });
}

function optionalCookiesGroups(cookieGroupList, lang) {
  cookieGroupList.forEach(cookieGroup => {
    buildGroup(cookieGroup, lang);
  });
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

/**
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

  // Access the template
  // const template = document.getElementById('hds-cookie-consent-template');
  // const templateContent = template.content;


  const translationKeys = getTranslationKeys();
  translationKeys.forEach(key => {
    templateContents[key] = getTranslation(key, lang, cookieData);
    // TODO: consider the following
    templateContents.translations[key] = getTranslation(key, lang, cookieData);
  });

  // Allow the translations to be built before HTML templating
  requiredCookiesGroups(cookieData.requiredCookies.groups, lang);
  optionalCookiesGroups(cookieData.optionalCookies.groups, lang);
  // Clone the template content and append it to the shadow root
  // shadowRoot.appendChild(templateContent.cloneNode(true));
  shadowRoot.innerHTML += getCookieBannerHTML(templateContents);

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

import { parse, serialize } from 'cookie/index';
import getCookieBannerHTML from './template';
import { getTranslation, getTranslationKeys } from './hds-cc_translations';

const templateContents = { test: 'test string' };

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

function buildRow(cookie, lang) {
return `<tr>
  <td>${cookie.id}</td>
  <td>${cookie.host}</td>
  <td>${cookie.description[lang]}</td>
  <td>${cookie.expiration}</td>
  <td>${cookie.type}</td>
</tr>`;
}

function buildLists(listsElement, translations, lang, cookielist, status = 'requiredCookies') {
  const categoryContainer = document.createElement('div');

  // Cookie category one by one
  cookielist.groups.forEach(category => {
    const categoryElem = document.createElement('div');

    const catHeading = document.createElement('h3');
    catHeading.textContent = translations[window.hdsCcSettings.language][status].categories[category.commonGroup].title;
    categoryElem.appendChild(catHeading);

    const catDescription = document.createElement('p');
    catDescription.textContent = translations[window.hdsCcSettings.language][status].categories[category.commonGroup].description;
    categoryElem.appendChild(catDescription);

    // Create the table
    const cookieTable = document.createElement('table');
    categoryElem.appendChild(cookieTable);

    // Head
    const tableHead = document.createElement('thead');
    const thRow = document.createElement('tr');

    const thName = document.createElement('th');
    thName.textContent = translations[window.hdsCcSettings.language].tableHeadings.name;

    const thHost = document.createElement('th');
    thHost.textContent = translations[window.hdsCcSettings.language].tableHeadings.host;

    const thDescription = document.createElement('th');
    thDescription.textContent = translations[window.hdsCcSettings.language].tableHeadings.description;

    const thExpiration = document.createElement('th');
    thExpiration.textContent = translations[window.hdsCcSettings.language].tableHeadings.expiration;

    const thType = document.createElement('th');
    thType.textContent = translations[window.hdsCcSettings.language].tableHeadings.type;

    thRow.appendChild(thName);
    thRow.appendChild(thHost);
    thRow.appendChild(thDescription);
    thRow.appendChild(thExpiration);
    thRow.appendChild(thType);

    // Compile table head
    tableHead.appendChild(thRow);
    cookieTable.appendChild(tableHead);

    // Table to div
    categoryElem.appendChild(cookieTable);

    // Body
    const tableBody = document.createElement('tbody');

    templateContents[category] = '';
    category.cookies.forEach(cookie => {
      // tableBody.appendChild(buildRow(cookie, lang));
      templateContents[category.commonGroup] += buildRow(cookie, lang);
    });

    // Cookie table complete, add to listing
    cookieTable.appendChild(tableBody);
    categoryContainer.appendChild(categoryElem);
  });

  // listsElement.appendChild(categoryContainer);
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
  });

  // Clone the template content and append it to the shadow root
  // shadowRoot.appendChild(templateContent.cloneNode(true));
  shadowRoot.innerHTML += getCookieBannerHTML(templateContents);

  shadowRoot.querySelector('.hds-cc').focus();
}

const init = async () => {
  const lang = window.hdsCcSettings.language;
  window.chat_user_consent = chatUserConsent;

  const cookieData = await getCookieData();
  window.cookieData = cookieData;
  const { translations } = cookieData;

  const lists = null;
  buildLists(lists, translations, lang, cookieData.requiredCookies, 'requiredCookies');
  buildLists(lists, translations, lang, cookieData.optionalCookies, 'optionalCookies');
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
window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    setCookies();
  }
  if (e.code === 'ArrowUp') {
    updateCookieConsents();
  }
});

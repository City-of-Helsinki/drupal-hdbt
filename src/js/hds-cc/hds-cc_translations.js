/* eslint-disable no-template-curly-in-string */

const translations = {
  heading: {
    fi: '${siteName} käyttää evästeitä',
    sv: '${siteName} använder kakor',
    en: '${siteName} uses cookies',
  },
  description: {
    fi: 'Tämä sivusto käyttää välttämättömiä evästeitä sivun perustoimintojen ja suorituskyvyn varmistamiseksi. Lisäksi käytämme kohdennusevästeitä käyttäjäkokemuksen parantamiseksi, analytiikkaan ja yksilöidyn sisällön näyttämiseen.',
    sv: 'Denna webbplats använder obligatoriska kakor för att säkerställa de grundläggande funktionerna och prestandan. Dessutom använder vi inriktningskakor för bättre användarupplevelse, analytik och individualiserat innehåll.',
    en: 'This website uses required cookies to ensure the basic functionality and performance. In addition, we use targeting cookies to improve the user experience, perform analytics and display personalised content.',
  },
  readMore: {
    fi: 'Lue lisää',
    sv: 'Läs mer',
    en: 'Read more',
  },
  showSettings: {
    fi: 'Näytä evästeasetukset',
    sv: 'Visa kakinställningarna',
    en: 'Show cookie settings',
  },
  hideSettings: {
    fi: 'Piilota evästeasetukset',
    sv: 'Stänga kakinställningarna',
    en: 'Hide cookie settings',
  },
  form_heading: {
    fi: 'Tietoa sivustolla käytetyistä evästeistä',
    sv: 'Information om kakor som används på webbplatsen',
    en: 'About the cookies used on the website',
  },
  form_text: {
    fi: 'Sivustolla käytetyt evästeet on luokiteltu käyttötarkoituksen mukaan. Alla voit lukea eri luokista ja sallia tai kieltää evästeiden käytön.',
    sv: 'Kakorna som används på webbplatsen har klassificerats enligt användningsändamål. Du kan läsa om de olika klasserna och acceptera eller förbjuda användningen av kakor.',
    en: 'The cookies used on the website have been classified according to their intended use. Below, you can read about the various categories and accept or reject the use of cookies.',
  },
  approveAllConsents: {
    fi: 'Hyväksy kaikki evästeet',
    sv: 'Acceptera alla kakor',
    en: 'Accept all cookies',
  },
  approveRequiredAndSelectedConsents: {
    fi: 'Hyväksy valitut evästeet',
    sv: 'Acceptera valda kakor',
    en: 'Accept selected cookies',
  },
  approveOnlyRequiredConsents: {
    fi: 'Hyväksy vain välttämättömät evästeet',
    sv: 'Acceptera endast nödvändiga',
    en: 'Accept required cookies only',
  },
  // settingsSaved: {
  //   fi: 'Asetukset tallennettu!',
  //   sv: 'Inställningar sparade!',
  //   en: 'Settings saved!',
  // },
  tableHeadingsName: {
    fi: 'Nimi',
    sv: 'Namn',
    en: 'Name',
  },
  tableHeadingsHostName: {
    fi: 'Evästeen asettaja',
    sv: 'Den som lagrat kakan',
    en: 'Cookie set by',
  },
  tableHeadingsDescription: {
    fi: 'Käyttötarkoitus',
    sv: 'Användning',
    en: 'Purpose of use',
  },
  tableHeadingsExpiration: {
    fi: 'Voimassaoloaika',
    sv: 'Giltighetstid',
    en: 'Period of validity',
  },
  tableHeadingsType: {
    fi: 'Tyyppi',
    sv: 'Typ',
    en: 'Type',
  },
};

export function getTranslation(key, lang, parameters) {
  // Normal strings as template strings, use like:
  // index({ a: 1, b: 2 }, "${a} is smaller than ${b}")
  // returns: 1 is smaller than 2
  // https://stackoverflow.com/a/41540381
  function index(obj, is, value) {
    if (typeof is === 'string') {
      is = is.split('.');
    }
    if (is.length === 1 && value !== undefined) {
      obj[is[0]] = value;
      return value;
    }
    if (is.length === 0) {
      return obj;
    }
    return index(obj[is[0]], is.slice(1), value);
  }

  // Find translation based on key, fallback to English
  const translation = translations[key] ? translations[key][lang] || translations[key].en : null;

  if (translation) {

    // Replace dollar strings in translation with corresponding data from parameters
    return translation.replace(/\$\{.+?\}/g, (match) => {
      const stripDollarAndParenthesis = match.replace(/(^\$\{|\}$)/g, '');
      const parameter = index(parameters, stripDollarAndParenthesis);

      // Parameters may be either string or an language object
      if (typeof parameter === 'object' && parameter[lang]) {
        return parameter[lang];
      }
      // Use English as fallback language where possible
      if (typeof parameter === 'object' && parameter.en) {
        return parameter.en;
      }
      return parameter;
    });
  }
  throw new Error(`Missing translation: ${key}:${lang}`);
}

export function getTranslationKeys() {
  console.log('getTranslationKeys', Object.keys(translations));
  return Object.keys(translations);
}

import React from 'react';
import { CookieModal, useCookies } from 'hds-react';

export const useConsentStatus = () => {
  const { getAllConsents } = useCookies();
  const consents = getAllConsents();

  // console.log(consents);

  return consents;
};

const useCookieConsents = (): any => {
  // @ts-ignore
  // eslint-disable-line
  const [language, setLanguage] = React.useState('en');
  const onLanguageChange = (newLang: any) => setLanguage(newLang);

  return {
    siteName: 'helfi-etusivu.docker.so',
    currentLanguage: 'fi',
    focusTargetSelector: '#focused-element-after-cookie-consent-closed',
    requiredCookies: {
      groups: [
        {
          commonGroup: 'essential',
          cookies: [
            {
              id: 'cookiehub',
              hostName: 'CookieHub',
              name: 'cookiehub',
              description: 'Mahdollistaa evästehallinnan hel.fi sivuilla.	',
              expiration: '365 päivää'
            }
          ]
        }
      ]
    },
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [
            {
              id: 'hahaha',
              hostName: 'hel.fi',
              name: '_jeaaae.*',
              description: 'jeeaaajee',
              expiration: '393 päivää',
            },
            {
              id: 'matomo',
              hostName: 'hel.fi',
              name: '_pk_id.*',
              description: 'Matomo-tilastointijärjestelmän eväste.',
              expiration: '393 päivää',
            },
            {
              id: 'matomo_ses',
              hostName: 'hel.fi',
              name: '_pk_ses.141.89f6',
              description: 'Matomo-tilastointijärjestelmän eväste.',
              expiration: '1 tunti',
            },
            {
              id: 'matomo_palvelukartta',
              hostName: 'palvelukartta.hel.fi',
              name: '_pk_id.*',
              description: 'Matomo-tilastointijärjestelmän eväste.',
              expiration: '393 päivää',
            },
            {
              id: 'matomo_palvelukartta_ses',
              hostName: 'palvelukartta.hel.fi',
              name: '_pk_ses.*',
              description: 'Matomo-tilastointijärjestelmän eväste.',
              expiration: '1 tunti',
            },
            {
              id: 'rns',
              name: 'rnsbid',
              hostName: 'reactandshare.com',
              description: 'React & Share -reaktionappien toimintaan liittyvä tietue.',
              expiration: '-',
            },
            {
              id: 'rnsbid_ts',
              name: 'rnsbid_ts',
              hostName: 'reactandshare.com',
              description: 'React & Share -reaktionappien toimintaan liittyvä tietue.',
              expiration: '-',
            },
            {
              id: 'rns_reaction',
              name: 'rns_reaction_*',
              hostName: 'reactandshare.com',
              description: 'React & Share -reaktionappien toimintaan liittyvä tietue.',
              expiration: '-',
            },
          ],
        },
      ],
    },
    language: {
      onLanguageChange,
    },
    onAllConsentsGiven: (consents: any) => {
      /**
       * @TODO Check for better solution to get rid of Cookies needed infobox, when accepting cookies.
       */
      // console.log('onAllConsentsGiven', consents);
      // window.location.reload();
    },
  };
};

// Set a Cookie
function setCookie(cName: any, cValue: any, expDays: any) {
  const date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${  date.toUTCString()}`;
  document.cookie = `${cName  }=${  cValue  }; ${  expires  };`;
}

function CookieBanner() {
  const COOKIE_DOMAIN = 'helfi-etusivu.docker.so';
  const contentSource = useCookieConsents();
  // const consentStatus = useConsentStatus();

  return (
    <>
      {/* <button onClick={() => setCookie('leijuke.testi', 'keksi', 30)}>  Lisää keksi testi </button>
      <button onClick={() => setCookie('toinen.keksi', 'true', 30)}> Lisää keksi testi 2 </button> */}
      <CookieModal cookieDomain={COOKIE_DOMAIN} contentSource={contentSource} />
    </>
  );
}

export default CookieBanner;

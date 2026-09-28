/**
 * Configure Hyphenopoly 5.3.0
 *
 * See config options from:
 * https://github.com/mnater/Hyphenopoly/blob/master/docs/Config.md.
 */
const testWords = {
  fi: 'arvopaperimarkkinalainsäädäntö',
  sv: 'informationssäkerhetskampanj',
  en: 'supercalifragilisticexpialidocious',
};

document.addEventListener('DOMContentLoaded', function enableHyphenopoly() {
  if (typeof Hyphenopoly === 'undefined') return;

  // Load patterns only for the language which is loaded.
  const language = document.documentElement.lang;
  if (!testWords[language]) return;

  Hyphenopoly.config({
    require: { [language]: testWords[language] },
    fallbacks: { en: 'en-us' },
    setup: { hide: 'element', selectors: { '.hyphenate': {} } },
    handleEvent: {
      error(e) {
        e.preventDefault();
      },
    },
  });
});

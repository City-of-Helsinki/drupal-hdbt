/**
 * Configure Hyphenopoly 5.3.0
 *
 * See config options from:
 * https://github.com/mnater/Hyphenopoly/blob/master/docs/Config.md.
 */
document.addEventListener('DOMContentLoaded', function enableHyphenopoly() {
  if (typeof Hyphenopoly === 'undefined') return;
  Hyphenopoly.config({
    require: {
      fi: 'arvopaperimarkkinalainsäädäntö',
      sv: 'informationssäkerhetskampanj',
      en: 'supercalifragilisticexpialidocious',
    },
    fallbacks: {
      en: 'en-us',
    },
    setup: {
      selectors: {
        '.hyphenate': {},
      },
    },
    handleEvent: {
      error(e) {
        e.preventDefault();
      },
    },
  });
});

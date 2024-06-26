/**
 * Configure Hyphenopoly 5.3.0
 *
 * See config options from:
 * https://github.com/mnater/Hyphenopoly/blob/master/docs/Config.md.
 */
document.addEventListener('DOMContentLoaded', function enableHyphenopoly() {
  // eslint-disable-next-line no-undef
  Hyphenopoly.config({
    require: {
      'fi': 'yhdyssanahirviö',
      'sv': 'informationssäkerhetskampanj',
      'en': 'supercalifragilisticexpialidocious'
    },
    setup: {
      selectors: {
        '.hyphenate': {}
      }
    },
    handleEvent: {
      error (e) {
        e.preventDefault();
      }
    }
  });
});

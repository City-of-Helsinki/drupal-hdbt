/**
 * Configure Hyphenopoly 5.3.0
 *
 * See config options from:
 * https://github.com/mnater/Hyphenopoly/blob/master/docs/Config.md.
 */
((Drupal) => {
  Drupal.behaviors.hyphenopoly = {
    attach: () => {
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
    },
  };
})(Drupal);

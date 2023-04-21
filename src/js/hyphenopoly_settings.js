document.addEventListener('DOMContentLoaded', function enableHyphenopoly() {
  // eslint-disable-next-line no-undef
  Hyphenopoly.config({
    require: {
      'fi': 'yhdyssanahirviö', // use `FORCEHYPHENOPOLY` if you do not wish to autodetect hyphenation only load bigger code if needed
      'sv': 'informationssäkerhetskampanj'
    },
    setup: {
      selectors: {
        '.hyphenate': {}
      }
    },
  });
});

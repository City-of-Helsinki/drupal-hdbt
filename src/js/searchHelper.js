(function focusSearchResultsBehavior(Drupal) {
  function focusElement(element) {
    if (!element) return;
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Drupal.behaviors.focusSearchResults = {
    attach: function attachFocusSearchResults(context) {
      // Focus to titles using the hdbt-search__results__title class.
      const titles = context.querySelectorAll('.hdbt-search__results__title');
      if (titles.length) {
        focusElement(titles[0]);
      }

      // Don't move the focus on views based searchers first page load
      // where the search hasn't been submitted yet. The actual check is
      // done where the javascript is attached.
      if (!drupalSettings.theme || !drupalSettings.theme.searchActive) {
        return;
      }

      // Focus to the result count element. This is usually used in
      // views based searches.
      const resultCountEl = context.querySelector(
        '[class$="__count-container"]',
      );
      focusElement(resultCountEl);
    },
  };
})(Drupal);

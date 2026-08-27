(function focusSearchResultsBehavior(Drupal) {
  const PAGER_FLAG_KEY = 'hdbt_search_pager_clicked';

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

      // Always register pager link listeners, even before searchActive is set,
      // so that the very first pager click on a results page sets the flag.
      context.querySelectorAll('.pager a').forEach((link) => {
        link.addEventListener('click', () => {
          sessionStorage.setItem(PAGER_FLAG_KEY, '1');
        });
      });

      // When pager was clicked AND the current page still has a pager, focus
      // the first result link instead of the result count heading — matching
      // the behaviour of React-based searches. Checked before the searchActive
      // guard so it also works on views that never set searchActive (e.g. group
      // news archive). Always clear the flag so a stale value from a previous
      // page never interferes.
      const pagerClicked = sessionStorage.getItem(PAGER_FLAG_KEY);
      sessionStorage.removeItem(PAGER_FLAG_KEY);
      if (pagerClicked && context.querySelector('.pager a')) {
        focusElement(context.querySelector('.card__link'));
        return;
      }

      // Don't move the focus on views based searchers first page load
      // where the search hasn't been submitted yet. The actual check is
      // done where the javascript is attached.
      if (!drupalSettings.theme?.searchActive) {
        return;
      }

      // Focus to the result count element. This is usually used in
      // views based searches.
      const resultCountEl = context.querySelector('[class$="__count"]');
      focusElement(resultCountEl);
    },
  };
})(Drupal);

(function ($) {

  // Set focus on search result count
  $(document).ajaxComplete(function onDataLoaded(e, xhr, settings) {
    const resultCountEl = $('.unit-search__count-container')[0];
    if (!resultCountEl) return;
    resultCountEl.setAttribute('tabindex', '-1');
    resultCountEl.focus();
  });
})(jQuery);

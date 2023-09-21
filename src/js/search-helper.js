(function ($) {

  // Set focus on search result count
  $(document).ajaxComplete(function onDataLoaded(e, xhr, settings) {
    // Check form ID to prevent mixing on multi-form page
    const viewDomId = settings.extraData.view_dom_id;
    const resultsContainerEl = $(`[data-id-number=${  viewDomId  }]`);
    const resultCountEl = $('[class$="__count-container"]', resultsContainerEl[0])[0];
    
    if (!resultCountEl) return;
    resultCountEl.setAttribute('tabindex', '-1');
    resultCountEl.focus();
  });
})(jQuery);

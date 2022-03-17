(function ($, drupalSettings) {
  'use strict';

  // Helper function to hide all tabbed content.
  function hideEverything(tabbedContent) {
    let allTabs = tabbedContent.querySelectorAll('.tab');
    let allContent = tabbedContent.querySelectorAll('.tab__content');

    // Update visibility
    for (let i = 0; i < allTabs.length; i++) {
      allTabs[i].setAttribute('aria-selected', 'false');
      allContent[i].setAttribute('aria-hidden', 'true');
    }
  }

  // Make the given tab visible and hide other tabs.
  function toggleTabs(tab) {
    let tabParent = tab.closest('[data-drupal-selector="tabbed-content"]');
    let tabsContentId = tab.getAttribute('aria-controls');
    let tabsContent = document.querySelector('[data-drupal-selector=' + tabsContentId + ']');

    // First hide all tabs.
    hideEverything(tabParent);

    // Then show the selected tab.
    tab.setAttribute('aria-selected', 'true');
    tabsContent.setAttribute('aria-hidden', 'false');

    // Submit the search/filter form to refresh the map view.
    let filterForm = $('[id^=views-exposed-form-high-school-search-block]');

    if (filterForm.length) {
      $('.form-submit', filterForm).trigger('click');
    }
  }

  // Save the active tab and its content to session storage.
  function addToActiveTabStorage(activeTab) {
    const tabId = activeTab.dataset.drupalSelector;
    const contentId = activeTab.getAttribute('aria-controls');

    if (tabId && contentId) {
      window.sessionStorage.setItem('activeTab', tabId);
      window.sessionStorage.setItem('activeContent', contentId);
    }
  }

  function initiateTabs(activeTab, activeContent) {
    const containers = document.querySelectorAll('[data-drupal-selector="tabbed-content"]');

    // Loop through tabbed content containers.
    for (let i = 0; i < containers.length; i++) {
      let instance = containers[i];
      // Get the ID of the instance to be used to target elements.
      const tabInstaceId = instance.dataset.idNumber;

      // If the active tab is not set, use first tab as default.
      if (!activeTab) {
        activeTab = 'tab-1--' + tabInstaceId;
        activeContent = 'tab-1__content--' + tabInstaceId;
      }

      // Find the active tab elements.
      let activeTabElement = document.querySelector('[data-drupal-selector=' + activeTab + ']');
      let activeContentElement = document.querySelector('[data-drupal-selector=' + activeContent + ']');

      // Set them active with aria-attributes.
      activeTabElement.setAttribute('aria-selected', 'true');
      activeContentElement.setAttribute('aria-hidden', 'false');

      const allTabs = instance.querySelectorAll('.tab');

      // Go through all tabs and add a listener for mouse click or keyboard enter.
      for (let i = 0; i < allTabs.length; i++) {
        let tab = allTabs[i];

        tab.addEventListener('click', function () {
          // Toggle function.
          toggleTabs(this);
          addToActiveTabStorage(this);
        });
        tab.addEventListener('keydown', function (event) {
          if (event.which === 13) {
            toggleTabs(this);
            addToActiveTabStorage(this);
          }
        });
      }
    }
  }

  // Run after each ajax submit on the element that has tabs.
  $(document).ajaxComplete(function(e, xhr, settings) {
    if (settings.extraData.view_name === drupalSettings.tabsParent) {
      let activeTab = window.sessionStorage.getItem('activeTab');
      let activeContent =  window.sessionStorage.getItem('activeContent');
      initiateTabs(activeTab, activeContent);
    }
  });

  // Run after page is ready.
  $(document).ready(function () {
    // Clear the session storage on page reload.
    window.sessionStorage.removeItem('activeTab');
    window.sessionStorage.removeItem('activeContent');
    initiateTabs();
  });

})(jQuery, drupalSettings);

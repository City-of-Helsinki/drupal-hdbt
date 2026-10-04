(($, drupalSettings) => {
  // Module-level variables to store active tab state
  let activeTabId = null;
  let activeContentId = null;

  // Helper function to hide all tabbed content.
  function hideEverything(tabbedContent) {
    const allTabs = tabbedContent.querySelectorAll('.tab');
    const allContent = tabbedContent.querySelectorAll('.tab__content');
    // Update visibility
    for (let i = 0; i < allTabs.length; i++) {
      allTabs[i].setAttribute('aria-selected', 'false');
      allTabs[i].setAttribute('tabindex', '-1');
      allContent[i].setAttribute('aria-hidden', 'true');
    }
  }

  // Make the given tab visible and hide other tabs.
  function toggleTabs(tab) {
    const tabParent = tab.closest('[data-drupal-selector="tabbed-content"]');
    const tabsContentId = tab.getAttribute('aria-controls');
    if (!tabsContentId) return;
    const tabsContent = document.querySelector(`[data-drupal-selector="${tabsContentId}"]`);

    // First hide all tabs.
    hideEverything(tabParent);

    // Then show the selected tab.
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tabsContent.setAttribute('aria-hidden', 'false');

    // Refresh the map view by submitting the search/filter form.
    if (tabsContentId.startsWith('tab-2')) {
      const filterForm = $('[id^=views-exposed-form-high-school-search-block]');
      if (filterForm.length) {
        $('.form-submit', filterForm).trigger('click');
      }
    }
  }

  // Save the active tab and its content to variables
  function updateActiveTab(activeTab) {
    const tabId = activeTab.dataset.drupalSelector;
    const contentId = activeTab.getAttribute('aria-controls');

    if (tabId && contentId) {
      activeTabId = tabId;
      activeContentId = contentId;
    }
  }

  // Move focus to the tab matching the pressed key, following the WAI-ARIA APG
  // tabs pattern with manual activation: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
  // The focused tab is selected with Enter or Space, which buttons translate
  // into a click.
  function onTabKeydown(event) {
    const tabs = Array.from(this.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
    const index = tabs.indexOf(this);
    const last = tabs.length - 1;
    let next;

    switch (event.key) {
      case 'ArrowRight':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    // Make the focused tab the tabbable one so Tab leaves the tablist.
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('tabindex', i === next ? '0' : '-1');
    }
    tabs[next].focus();
  }

  // When focus leaves the tablist, make the selected tab tabbable again so
  // that entering the tablist focuses it.
  function onTablistFocusout(event) {
    if (this.contains(event.relatedTarget)) return;

    const tabs = this.querySelectorAll('[role="tab"]');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('tabindex', tabs[i].getAttribute('aria-selected') === 'true' ? '0' : '-1');
    }
  }

  function initiateTabs(activeTab, activeContent) {
    const containers = document.querySelectorAll('[data-drupal-selector="tabbed-content"]');

    // Guard clause if no containers found
    if (!containers.length) return;

    // Loop through tabbed content containers.
    for (let i = 0; i < containers.length; i++) {
      const instance = containers[i];
      // Get the ID of the instance to be used to target elements.
      const tabInstaceId = instance.dataset.idNumber;

      // If the active tab is not set, use first tab as default.
      if (!activeTab) {
        activeTab = `tab-1--${tabInstaceId}`;
        activeContent = `tab-1__content--${tabInstaceId}`;
      }

      // Find the active tab elements.
      const activeTabElement = document.querySelector(`[data-drupal-selector="${activeTab}"]`);
      const activeContentElement = document.querySelector(`[data-drupal-selector="${activeContent}"]`);

      // Guard clause if elements not found
      if (!activeTabElement || !activeContentElement) {
        console.warn('Tab elements not found:', { activeTab, activeContent });
        return;
      }

      const allTabs = instance.querySelectorAll('.tab');
      instance.querySelector('[role="tablist"]')?.addEventListener('focusout', onTablistFocusout);

      // Only the active tab is in the tab sequence, the rest are reached with
      // arrow keys.
      for (let j = 0; j < allTabs.length; j++) {
        allTabs[j].setAttribute('tabindex', '-1');
      }

      // Set them active with aria-attributes.
      activeTabElement.setAttribute('aria-selected', 'true');
      activeTabElement.setAttribute('tabindex', '0');
      activeContentElement.setAttribute('aria-hidden', 'false');

      // Go through all tabs and add listeners for mouse click and keyboard.
      for (let j = 0; j < allTabs.length; j++) {
        const tab = allTabs[j];

        tab.addEventListener('click', function onTabClick() {
          // Toggle function.
          toggleTabs(this);
          updateActiveTab(this);
        });
        tab.addEventListener('keydown', onTabKeydown);
      }
    }
  }

  // Run after each ajax submit on the element that has tabs.
  $(document).ajaxComplete(function onDataLoaded(_e, _xhr, settings) {
    if (settings.extraData.view_name === drupalSettings.tabsParent) {
      initiateTabs(activeTabId, activeContentId);
    }
  });

  // Run after page is ready.
  $(document).ready(() => {
    // Reset the active tab variables
    activeTabId = null;
    activeContentId = null;
    initiateTabs();
  });
})(jQuery, drupalSettings);

document.addEventListener('DOMContentLoaded', function () {

  function hideEverything(tabbedContent) {
    let allTabs = tabbedContent.querySelectorAll('.tab');
    let allContent = tabbedContent.querySelectorAll('.tab__content');

    // Update visibility
    for (let i = 0; i < allTabs.length; i++) {
      allTabs[i].setAttribute('aria-selected', 'false');
      allContent[i].setAttribute('aria-hidden', 'true');
    }
  }

  function toggleTabs(tab) {
    let tabParent = tab.closest('[data-drupal-selector="tabbed-content"]');
    let tabsContentId = tab.getAttribute('aria-controls');
    let tabsContent = document.getElementById(tabsContentId);

    hideEverything(tabParent);

    tab.setAttribute('aria-selected', 'true');
    tabsContent.setAttribute('aria-hidden', 'false');
  }

  const containers = document.querySelectorAll('[data-drupal-selector="tabbed-content"]');

  // Loop through tabbed content containers.
  for (let i = 0; i < containers.length; i++) {
    let instance = containers[i];
    // Get the ID of the instance to be used to target elements.
    const tabInstaceId = instance.dataset.idNumber;

    // Get the first tab and its content as active tabs.
    let activeTab = document.getElementById('tab-1--' + tabInstaceId);
    let activeContent = document.getElementById('tab-1__content--' + tabInstaceId);

    // Set them active with aria-attributes.
    activeTab.setAttribute('aria-selected', 'true');
    activeContent.setAttribute('aria-hidden', 'false');

    const allTabs =  instance.querySelectorAll('.tab');

    for (let i = 0; i < allTabs.length; i++) {
      let tab = allTabs[i];

      tab.addEventListener('click', function(event) {
        // Toggle function.
        toggleTabs(this);
      });
      tab.addEventListener('keydown', function(event) {
        if (event.which === 13) {
          toggleTabs(this);
        }
      });
    }
  }
});

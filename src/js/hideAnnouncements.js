import LocalStorageManager from './localStorageManager';

/**
 * Hide announcements that have been hidden by the user.
 *
 * This script needs to be loaded and executed early (in the page header) to
 * allow the following steps to be performed:
 *
 * 1. Registers a MutationObserver to listen for when the announcement
 *    container is added to the document.
 * 2. When the announcement container is added, registers a new observer
 *    to listen for when the announcement items are added to the container.
 * 3. When the announcement items are added, checks if any of them have been
 *    hidden by the user and removes them from the document as soon as they are
 *    added. This should be instant enough to avoid a flickering effect.
 */
(() => {
  const announcementContainerId = 'block-hdbt-subtheme-announcements';
  const storageManager = new LocalStorageManager('helfi-settings');
  let announcementContainerNode = null;

  /**
   * MutationObserver callback.
   *
   * Listens for when the announcement items are added to the announcement
   * container.
   */
  const announcementItemsAddedListener = () => {
    const uuidsToHide = storageManager.getValue('hidden-helfi-announcements');
    const elements = announcementContainerNode.querySelectorAll('.js-announcement');

    if (!uuidsToHide || !elements) {
      return;
    }

    elements.forEach((element) => {
      const { uuid } = element.dataset;
      if (uuidsToHide.includes(uuid)) {
        element.remove();
      }
    });
  };

  /**
   * MutationObserver callback.
   *
   * Listens for when the announcement container node is added to the document.
   *
   * @param {MutationRecord[]} mutations - The mutations that occurred.
   */
  const announcementContainerAddedListener = (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.id === announcementContainerId) {
          announcementContainerNode = node;

          // Register a MutationObserver to listen for when the announcement
          // items are added to the document.
          const announcementItemsObserver = new MutationObserver(announcementItemsAddedListener);
          announcementItemsObserver.observe(node, { childList: true, subtree: false });

          // Run the callback immediately in case the children were added
          // before the observer was registered.
          announcementItemsAddedListener();

          // Disconnect the document observer after the target node is added.
          announcementContainerObserver.disconnect();
        }
      }
    }
  };

  // Register a MutationObserver to listen for when the announcement container
  // is added to the document.
  const announcementContainerObserver = new MutationObserver(announcementContainerAddedListener);
  announcementContainerObserver.observe(document, { childList: true, subtree: true });
})();

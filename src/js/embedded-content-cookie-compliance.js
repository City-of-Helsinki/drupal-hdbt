/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 */
// eslint-disable-next-line func-names
(function ($, Drupal, drupalSettings) {

  // Check whether the given cookie categories have been accepted.
  const categoriesAgreed = (categories) => {
    // Set default categories if none exists.
    if (!categories) {
      categories = ['preferences', 'statistics'];
    }
    return Drupal.cookieConsent.getConsentStatus(categories);
  };

  const loadEmbeddedContent = () => {
    Object.entries(drupalSettings?.embedded_media_attributes || {})
      .forEach(([id, attributes]) => {
        if (!categoriesAgreed(attributes?.cookieConsentGroups)) {
          return;
        }

      const mediaContainers = $(`.embedded-content-cookie-compliance.media-${id}`);

      // Each of the media type is grouped to their own mediaContainers so we need to iterate through them.
      mediaContainers.each(function processMediaContainer() {
        const mediaContainer = $(this);

        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('media-oembed-content');
        iframeElement.src = attributes.src;
        iframeElement.title = attributes.title;

        if (attributes.allow) {
          iframeElement.allow = attributes.allow;
        }

        if (attributes.height) {
          iframeElement.height = attributes.height;
        }
        if (attributes.width) {
          iframeElement.width = attributes.width;
        }

        const skipLinkBefore = document.createElement('a');
        skipLinkBefore.classList.add('focusable', 'skip-link');
        skipLinkBefore.href = `#${attributes.skipLinkAfterId}`;
        skipLinkBefore.id = attributes.skipLinkBeforeId;

        const skipLinkAfter = document.createElement('a');
        skipLinkAfter.classList.add('focusable', 'skip-link');
        skipLinkAfter.href = `#${attributes.skipLinkBeforeId}`;
        skipLinkAfter.id = attributes.skipLinkAfterId;

        const containerElement = document.createElement('div');
        containerElement.appendChild(iframeElement);

        // Extract the media name from the wrapping component element.
        // Fallback to empty if no title is set. Currently only used in map.
        const mediaName = mediaContainer.parent().prevAll('h2').first().text().trim() || '';

        switch (attributes.type) {
          case 'video':
          case 'chart':
            containerElement.classList.add(`responsive-${attributes.type}-container`);
            mediaContainer
              .empty()
              .append(containerElement)
              .removeClass(`media-${id}`);
            break;

          case 'journey_planner':
            containerElement.classList.add('journey-planner-container');
            skipLinkAfter.classList.add('skip-link--planner--after');
            skipLinkBefore.classList.add('skip-link--planner--before');
            skipLinkAfter.text = Drupal.t('Continue above the journey planner', {}, { context: 'Skip link after the journey planner for the journey planner paragraph' });
            skipLinkBefore.text = Drupal.t('Continue below the journey planner', {}, { context: 'Skip link before the journey planner for the journey planner paragraph' });
            mediaContainer
              .replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          case 'map':
            containerElement.classList.add('responsive-map-container');
            skipLinkAfter.classList.add('skip-link--map--after');
            skipLinkBefore.classList.add('skip-link--map--before');

            // Adjust the skip link text based on whether the mediaName is found.
            skipLinkAfter.text = mediaName
              ? Drupal.t('Continue above the @map map', { '@map': mediaName }, { context: 'Skip link after the map for the map paragraph' })
              : Drupal.t('Continue above the map', {}, { context: 'Skip link after the map for the map paragraph' });

            skipLinkBefore.text = mediaName
              ? Drupal.t('Continue below the @map map', { '@map': mediaName }, { context: 'Skip link before the map for the map paragraph' })
              : Drupal.t('Continue below the map', {}, { context: 'Skip link before the map for the map paragraph' });

            mediaContainer.replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          default:
            break;
        }
      });
    });
  };

  // Remove noscript element.
  $('.embedded-content-cookie-compliance .js-remove').remove();

  if (Drupal.cookieConsent.initialized()) {
    loadEmbeddedContent();
  } else {
    Drupal.cookieConsent.loadFunction(loadEmbeddedContent);
  }
})(jQuery, Drupal, drupalSettings);

/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 */
// eslint-disable-next-line func-names
(function ($, Drupal, drupalSettings) {

  const loadEmbeddedContent = () => {
    if (
      Drupal.cookieConsent.getConsentStatus(['preferences', 'statistics']) &&
      drupalSettings.embedded_media_attributes
    ) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [id, attributes] of Object.entries(drupalSettings.embedded_media_attributes)) {
        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('media-oembed-content');
        iframeElement.src = attributes.src;
        iframeElement.title = attributes.title;
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
        if (attributes.type === 'video') {
          containerElement.classList.add('responsive-video-container');
          $(`.embedded-content-cookie-compliance.media-${id}`)
            .empty()
            .append(containerElement)
            .removeClass(`media-${id}`);
        } else if (attributes.type === 'map') {
          containerElement.classList.add('responsive-map-container');
          skipLinkAfter.classList.add('skip-link--map--after');
          skipLinkBefore.classList.add('skip-link--map--before');
          skipLinkAfter.text = Drupal.t('Continue above the map', {}, { context: 'Skip link after the map for the map paragraph' });
          skipLinkBefore.text = Drupal.t('Continue below the map', {}, { context: 'Skip link before the map for the map paragraph' });
          $(`.embedded-content-cookie-compliance.media-${id}`)
            .replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
        } else if (attributes.type === 'journey_planner') {
          containerElement.classList.add('journey-planner-container');
          skipLinkAfter.classList.add('skip-link--planner--after');
          skipLinkBefore.classList.add('skip-link--planner--before');
          skipLinkAfter.text = Drupal.t('Continue above the journey planner', {}, { context: 'Skip link after the journey planner for the journey planner paragraph' });
          skipLinkBefore.text = Drupal.t('Continue below the journey planner', {}, { context: 'Skip link before the journey planner for the journey planner paragraph' });
          $(`.embedded-content-cookie-compliance.media-${id}`)
            .replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
        }
      }
    }
  };

  // Remove noscript element.
  $('.embedded-content-cookie-compliance .js-remove').remove();

  if (Drupal.cookieConsent.initialized()) {
    loadEmbeddedContent();
  } else {
    Drupal.cookieConsent.loadFunction(loadEmbeddedContent);
  }
})(jQuery, Drupal, drupalSettings);

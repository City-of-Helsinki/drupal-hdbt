/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 *
 * Depends on EU Cookie Compliance module.
 */
// eslint-disable-next-line func-names
(function ($, Drupal, drupalSettings) {
  function loadEmbeddedContent() {
    if (typeof Drupal.eu_cookie_compliance === 'undefined') {
      return;
    }

    if (Drupal.eu_cookie_compliance.hasAgreed('preference') && Drupal.eu_cookie_compliance.hasAgreed('statistics')) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [id, attributes] of Object.entries(drupalSettings.embedded_media_attributes)) {
        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('media-oembed-content');
        iframeElement.src = attributes.src;
        iframeElement.height = attributes.height;
        iframeElement.width = attributes.width;
        iframeElement.title = attributes.title;

        const containerElement = document.createElement('div');
        containerElement.classList.add('responsive-video-container');
        containerElement.appendChild(iframeElement);

        $(`.embedded-content-cookie-compliance.media-${id}`)
          .empty()
          .append(containerElement)
          .removeClass(`media-${id}`);
      }

      // Only load the embedded content once.
      $(document).off('eu_cookie_compliance.changeStatus', loadEmbeddedContent);
    }
  }

  // Run after choosing cookie settings.
  $(document).on('eu_cookie_compliance.changeStatus', loadEmbeddedContent);

  // Run after page is ready.
  $(document).ready(loadEmbeddedContent);
})(jQuery, Drupal, drupalSettings);

/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 *
 * Depends on EU Cookie Compliance module.
 */
(function ($, Drupal, drupalSettings) {
  'use strict';

  var loadEmbeddedContent = function () {
    if (typeof Drupal.eu_cookie_compliance === 'undefined') {
      return;
    }

    if (
      Drupal.eu_cookie_compliance.hasAgreed('preference') &&
      Drupal.eu_cookie_compliance.hasAgreed('statistics')
    ) {
      for (const [id, attributes] of Object.entries(
        drupalSettings.embedded_media_attributes
      )) {
        var iframeElement = document.createElement('iframe');
        iframeElement.classList.add('media-oembed-content');
        iframeElement.src = attributes.src;
        iframeElement.height = attributes.height;
        iframeElement.width = attributes.width;
        iframeElement.title = attributes.title;

        var containerElement = document.createElement('div');
        containerElement.classList.add('responsive-video-container');
        containerElement.appendChild(iframeElement);

        $('.embedded-content-cookie-compliance.media-' + id)
          .empty()
          .append(containerElement)
          .removeClass('media-' + id);
      }

      // Only load the embedded content once.
      loadEmbeddedContent = function () {};
    }
  };

  // Run after choosing cookie settings.
  $(document).on('eu_cookie_compliance.changeStatus', loadEmbeddedContent);

  // Run after page is ready.
  $(document).ready(function () {
    loadEmbeddedContent();
  });
})(jQuery, Drupal, drupalSettings);

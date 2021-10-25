/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 *
 * Depends on EU Cookie Compliance module.
 */
(function ($, Drupal, drupalSettings) {
  'use strict';

  var loadEmbeddedContent = function () {
    if (typeof Drupal.eu_cookie_compliance !== 'undefined') {
      if (Drupal.eu_cookie_compliance.hasAgreed('performance_ux')) {
        // @todo Change category
        for (const [id, attributes] of Object.entries(
          drupalSettings.embedded_media_attributes
        )) {
          var elem = document.createElement('iframe');
          elem.src = attributes.src;
          $('.embedded-content-cookie-complience.' + id)
            .empty()
            .append(elem);
        }

        // Only load the embedded content once.
        loadEmbeddedContent = function () {};
      }
    }
  };

  // Run after choosing cookie settings.
  $(document).on('eu_cookie_compliance.changeStatus', loadEmbeddedContent);

  // Run after page is ready.
  $(document).ready(function () {
    loadEmbeddedContent();
  });
})(jQuery, Drupal, drupalSettings);

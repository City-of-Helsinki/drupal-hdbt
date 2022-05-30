(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.disable_genesys_button = {
    attach: function (context, settings) {
      // Don't show the button if the chat element does not exist.
      if (typeof(_genesys) === 'undefined') {
        $('#openChat').replaceWith('<div>' + Drupal.t('Chat is not in use.') + '</div>');
      }
    }
  };

})(jQuery, Drupal, drupalSettings);

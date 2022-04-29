(function ($, Drupal) {
  'use strict';

  var loadMatomoAnalytics = function () {
    if (typeof Drupal.eu_cookie_compliance === 'undefined') {
      return;
    }

    if (Drupal.eu_cookie_compliance.hasAgreed('statistics')) {
      var _mtm = (window._mtm = window._mtm || []);
      _mtm.push({
        'mtm.startTime': new Date().getTime(),
        event: 'mtm.Start',
      });
      var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.async = true;
      g.src = '//webanalytics.digiaiiris.com/js/container_X3dUNyXY.js';
      s.parentNode.insertBefore(g, s);
    }
  };

  // Load when cookie settings are changed.
  $(document).on('eu_cookie_compliance.changeStatus', loadMatomoAnalytics());

  // Load on page load.
  $(document).ready(function () {
    loadMatomoAnalytics();
  });
})(jQuery, Drupal);

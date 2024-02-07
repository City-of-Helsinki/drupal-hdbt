// eslint-disable-next-line func-names
(function ($, Drupal) {
  function loadMatomoAnalytics() {
    // Check if the user qualifies for Matomo
    let followUser = false;
    // Currently limited to anonymous users, might need some role
    // based ID fetching later on
    const followedUserIds = [0];

    try {
      followUser = followedUserIds.includes(drupalSettings.user.uid);
    } catch (err) {
      console.log('user settings not available');
    }

    if (typeof Drupal.eu_cookie_compliance === 'undefined') {
      return;
    }

    // Load Matomo only if statistics cookies are allowed.
    if (
      Drupal.eu_cookie_compliance.hasAgreed('statistics') &&
      followUser
    ) {
      // Matomo Tag Manager
      // eslint-disable-next-line no-multi-assign
      const _mtm = (window._mtm = window._mtm || []);
      _mtm.push({
        'mtm.startTime': new Date().getTime(),
        event: 'mtm.Start',
      });
      const d = document;
      const g = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.async = true;
      g.src = '//webanalytics.digiaiiris.com/js/container_X3dUNyXY.js';
      s.parentNode.insertBefore(g, s);
    }
  }

  // Load when cookie settings are changed.
  $(document).on('eu_cookie_compliance.changeStatus', loadMatomoAnalytics());

  // Load on page load.
  $(document).ready(loadMatomoAnalytics);
})(jQuery, Drupal);

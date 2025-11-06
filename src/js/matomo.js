function getBrowserSize() {
  const width = Math.round(window.innerWidth / 10) * 10;
  const height = Math.round(window.innerHeight / 10) * 10;
  return `${width}x${height}`;
}

((Drupal) => {
  function loadMatomoAnalytics() {
    const { helfi_environment: environment } = drupalSettings;

    if (
      !(
        Drupal.cookieConsent.getConsentStatus(['statistics']) &&
        drupalSettings.matomo_site_id
      )
    ) {
      return;
    }
    const getViewportWidth = () => window.innerWidth;
    const getViewportHeight = () => window.innerHeight;
    const getLanguage = () => document.querySelector('html')?.lang || 'unknown';
    const getPublishedTime = () =>
      document.querySelector('meta[property="article:published_time"]')
        ?.content || '';
    const getUpdatedTime = () =>
      document.querySelector('meta[property="og:updated_time"]')?.content || '';
    const getNewsTaxonomyTermIds = () => drupalSettings.news_taxonomy_term_ids;
    // biome-ignore lint/suspicious/noAssignInExpressions: _paq assignment is intentional.
    const _paq = (window._paq = window._paq || []);
    const excludedParams = [
      'maintheme',
      'channeltype',
      'errandservicetype',
      'targetgroup',
      'year',
      'doc',
      'ls',
      'vdoc',
      'dkey',
      'pno',
      'dir',
      'buttonName',
      'familyIncome',
      'fulltime',
      'daysoff',
      'familySize',
      'submitButton',
      'cn',
      'pd',
      'sivu',
      'tyoPaikkaAla',
      'HELP_MODE',
      'tyoSanaHakuKentta',
      'SHOW_TOOLS',
      'haeTyopaikkojaBTN',
      'nayta-kesa',
      'redir',
      'chatMode',
      'id',
      'Id',
      'feedbackId',
      'fid',
      'up',
      'p',
      'c',
      'tyoSuhtTyyppi',
      'kielisyys',
      'cityarea',
      'selection',
      'contentViewMode',
      'v',
      'INFO_MODE',
      'EDIT_MODE',
      'PAGE_MODES',
      'showyears',
      'categories',
      'categories2',
      'MOD',
      'newfeatures',
      'format',
      'contentID',
      'useDefaultText',
      'useDefaultDesc',
      'li_fat_id',
      'lmod',
      'CACHEID',
      '__FB_PRIVATE_TRACKING__',
      'as_qdr',
      'as_occt',
      'as_q',
      'contentIDR',
      'id-2939',
      'redir3',
      'urile',
      'sa',
      'ved',
      'resetButton',
      'hcb',
      'cep',
      'service_node',
      'setlanguage',
      'continueFlag',
      'nayta-kaikki',
      'trk',
      'existed',
      'logout',
      'attachedData',
      'next',
      'ref_ttesl_hdh_ep1',
      'sort',
      'customerid',
      'CVID',
      'amp',
      '1dmy',
      'osoite',
      'mailto',
      'Siirtyy%20jaoston%20p\u00e4\u00e4t\u00f6sasiakirjoihin.',
      'Siirtyy%20sivutossa%20jaoston%20p\u00e4\u00e4t\u00f6sasiakirjojen%20kohtaan.',
      'v:file',
      'v:state',
      'btnG',
      'current',
      'readclass',
      'safe',
      "/'javascript:?%27%20class=%27ch2-open-settings-btn%27%20onClick=%27cookiehub.openSettings()%27",
      'row',
      'start',
      'end',
      'mode',
      'zarsrc',
      'gws_rd',
      'showfromdate',
      '^.*\\@hel.fi$',
      "' class",
      '%27%20class',
      'class',
      '_sm_au_',
      'action',
      'Siirtyy jaoston p\u00e4\u00e4t\u00f6sasiakirjoihin.',
      'Siirtyy sivutossa jaoston p\u00e4\u00e4t\u00f6sasiakirjojen kohtaan.',
      'ISCI',
      'usein kysytty\u00e4 palveluverkkosuunnittelusta',
      'Pelastussuunnitelma',
      'Palotarkastus',
      'recepient',
      'Action',
      'amp;current',
      'XIe',
      'dNe',
      'mc_cid',
      'mc_eid',
      'added',
      'client-request-id',
      'estsrequest',
      'ceid',
      'emid',
      'crmid',
      'identify',
      'elq',
      'elqaid',
      'elqat',
      'classId',
      'assignmentId',
      'gidzl',
      '_hsmi',
      '_hsenc',
      'tre',
      'trete',
      'pe_data',
      'o4e',
      'n4e',
      'check_logged_in',
      'code',
      'u4e',
      'itok',
      'WCM_PORTLET',
      'SessionExpired',
      'KYe',
      'WCM_GLOBAL_CONTEXT',
      'frosmo',
      'C_e',
      'name',
      'state',
      'ttclid',
      'acaToken',
      'wvstest',
      'max-depth',
      '__proto__[crVsaSZqMnW4EqBoI22emA]',
      '__proto__.crVsaSZqMnW4EqBoI22emA',
      'constructor.prototype[crVsaSZqMnW4EqBoI22emA]',
      'constructor.prototype.crVsaSZqMnW4EqBoI22emA',
      'constructor[prototype][crVsaSZqMnW4EqBoI22emA]',
      'gsid',
      'fbclid',
      'time',
      'complianz_scan_token',
      'complianz_id',
    ];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['setExcludedQueryParams', excludedParams]);
    _paq.push(['setCustomDimension', 2, getViewportWidth()]);
    _paq.push(['setCustomDimension', 3, getViewportHeight()]);
    _paq.push(['setCustomDimension', 4, getLanguage()]);
    _paq.push(['setCustomDimension', 5, getPublishedTime()]);
    _paq.push(['setCustomDimension', 6, getUpdatedTime()]);
    _paq.push(['setCustomDimension', 7, getBrowserSize()]);
    (() => {
      const u = '//webanalytics.digiaiiris.com/js/';
      // Etusivu ID is 141 (1292 in testing).
      const frontPage = ['141', '1292'];
      const siteId = String(drupalSettings.matomo_site_id);
      const isFrontPage = frontPage.includes(siteId);

      _paq.push(['setTrackerUrl', `${u}tracker.php`]);
      _paq.push(['setSiteId', environment === 'prod' ? '141' : '1292']);

      // Duplicate tracking of other sites to front page as well.
      if (!isFrontPage) {
        _paq.push([
          'addTracker',
          `${u}tracker.php`,
          drupalSettings.matomo_site_id,
        ]);
      }

      // If the site is Etusivu-instance and there are newsTaxonomyTermIds set, sent them to custom dimension.
      if (isFrontPage && getNewsTaxonomyTermIds()) {
        _paq.push(['setCustomDimension', 9, getNewsTaxonomyTermIds()]);
      }

      // Track page view after all configurations are set
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);

      const d = document;
      const g = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];
      // Generate a 6-character random string with mixed case letters and numbers
      const randomString = Math.random().toString(36).substring(2, 8);
      const currentUrl = encodeURIComponent(window.origin);
      g.async = true;
      g.src = `${u}piwik.min.js`;
      s.parentNode.insertBefore(g, s);

      // Load the heatmap plugin separately.
      const heatmapPluginBaseUrl =
        '//digiaiiris.com/web-analytics/plugins/HeatmapSessionRecording/';
      const heatmapPlugin = d.createElement('script');
      heatmapPlugin.src = `${heatmapPluginBaseUrl}configs.php?idsite=${drupalSettings.matomo_site_id}&trackerid=${randomString}&url=${currentUrl}`;
      s.parentNode.insertBefore(heatmapPlugin, s);

      _paq.push(['HeatmapSessionRecording::enableDebugMode']);
    })();
  }

  if (Drupal.cookieConsent.initialized()) {
    loadMatomoAnalytics();
  } else {
    Drupal.cookieConsent.loadFunction(loadMatomoAnalytics);
  }
})(Drupal);

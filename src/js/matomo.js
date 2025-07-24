function getBrowserSize() {
  let width = null;
  if (window.innerWidth) {
    width = window.innerWidth;
  } else if (document.documentElement && document.documentElement.clientWidth) {
    width = document.documentElement.clientWidth;
  } else if (document.body && document.body.clientWidth) {
    width = document.body.clientWidth;
  }
  if (typeof width === 'number') {
    width = Math.round(width / 10) * 10;
  }
  let height = null;
  if (window.innerHeight) {
    height = window.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) {
    height = document.documentElement.clientHeight;
  } else if (document.body && document.body.clientHeight) {
    height = document.body.clientHeight;
  }
  if (typeof height === 'number') {
    height = Math.round(height / 10) * 10;
  }
  return `${width}x${height}`;
}

// eslint-disable-next-line func-names
(function ($, Drupal) {
  function loadMatomoAnalytics() {
    const { helfi_environment: environment } = drupalSettings;

    if (!(Drupal.cookieConsent.getConsentStatus(['statistics']) && drupalSettings.matomo_site_id)) {
      return;
    }

    const getViewportWidth = () => window.innerWidth;
    const getViewportHeight = () => window.innerHeight;
    const getLanguage = () => document.querySelector('html')?.attributes?.lang?.value || 'unkown';
    const getPublishedTime = () => document.querySelector('meta[property="article:published_time"]')?.content || '';
    const getUpdatedTime = () => document.querySelector('meta[property="og:updated_time"]')?.content || '';
    const newsTaxonomyTermIds = () => drupalSettings.news_taxonomy_term_ids;
    // eslint-disable-next-line no-multi-assign
    const _paq = window._paq = window._paq || [];
    // eslint-disable-next-line no-useless-escape
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    // eslint-disable-next-line no-useless-escape
    _paq.push(['setExcludedQueryParams', ['maintheme','channeltype','errandservicetype','targetgroup','year','doc','ls','vdoc','dkey','pno','dir','buttonName','familyIncome','fulltime','daysoff','familySize','submitButton','cn','pd','sivu','tyoPaikkaAla','HELP_MODE','tyoSanaHakuKentta','SHOW_TOOLS','haeTyopaikkojaBTN','nayta-kesa','redir','chatMode','id','Id','feedbackId','fid','up','p','c','tyoSuhtTyyppi','kielisyys','cityarea','selection','contentViewMode','v','INFO_MODE','EDIT_MODE','PAGE_MODES','showyears','categories','categories2','MOD','newfeatures','format','contentID','useDefaultText','useDefaultDesc','li_fat_id','lmod','CACHEID','__FB_PRIVATE_TRACKING__','as_qdr','as_occt','as_q','contentIDR','id-2939','redir3','urile','sa','ved','resetButton','hcb','cep','service_node','setlanguage','continueFlag','nayta-kaikki','trk','existed','logout','attachedData','next','ref_ttesl_hdh_ep1','sort','customerid','CVID','amp','1dmy','osoite','mailto','Siirtyy%20jaoston%20p\u00e4\u00e4t\u00f6sasiakirjoihin.','Siirtyy%20sivutossa%20jaoston%20p\u00e4\u00e4t\u00f6sasiakirjojen%20kohtaan.','v:file','v:state','btnG','current','readclass','safe','\/\'javascript:?%27%20class=%27ch2-open-settings-btn%27%20onClick=%27cookiehub.openSettings()%27','row','start','end','mode','zarsrc','gws_rd','showfromdate','^.*\\@hel.fi$','\' class','%27%20class','class','_sm_au_','action','Siirtyy jaoston p\u00e4\u00e4t\u00f6sasiakirjoihin.','Siirtyy sivutossa jaoston p\u00e4\u00e4t\u00f6sasiakirjojen kohtaan.','ISCI','usein kysytty\u00e4 palveluverkkosuunnittelusta','Pelastussuunnitelma','Palotarkastus','recepient','Action','amp;current','XIe','dNe','mc_cid','mc_eid','added','client-request-id','estsrequest','ceid','emid','crmid','identify','elq','elqaid','elqat','classId','assignmentId','gidzl','_hsmi','_hsenc','tre','trete','pe_data','o4e','n4e','check_logged_in','code','u4e','itok','WCM_PORTLET','SessionExpired','KYe','WCM_GLOBAL_CONTEXT','frosmo','C_e','name','state','ttclid','acaToken','wvstest','max-depth','__proto__[crVsaSZqMnW4EqBoI22emA]','__proto__.crVsaSZqMnW4EqBoI22emA','constructor.prototype[crVsaSZqMnW4EqBoI22emA]','constructor.prototype.crVsaSZqMnW4EqBoI22emA','constructor[prototype][crVsaSZqMnW4EqBoI22emA]','gsid','fbclid','time','complianz_scan_token','complianz_id']]);
    _paq.push(['setCustomDimension', 2, getViewportWidth()]);
    _paq.push(['setCustomDimension', 3, getViewportHeight()]);
    _paq.push(['setCustomDimension', 4, getLanguage()]);
    _paq.push(['setCustomDimension', 5, getPublishedTime()]);
    _paq.push(['setCustomDimension', 6, getUpdatedTime()]);
    _paq.push(['setCustomDimension', 7, getBrowserSize()]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    // eslint-disable-next-line func-names
    (function() {
      const u='//webanalytics.digiaiiris.com/js/';
      _paq.push(['setTrackerUrl', `${u}tracker.php`]);
      _paq.push(['setSiteId', environment === 'prod' ? '141' : '1292']);

      // Etusivu ID is 141 (1292 in testing). Duplicate tracking for other sites.
      if (!['141', '1292'].includes(drupalSettings.matomo_site_id.toString())) {
        _paq.push(['addTracker', `${u}tracker.php`, drupalSettings.matomo_site_id]);
      }

      // If the site is Etusivu-instance and there are newsTaxonomyTermIds set, sent them to custom dimension.
      if (['141', '1292'].includes(drupalSettings.matomo_site_id.toString()) && newsTaxonomyTermIds()) {
        _paq.push(['setCustomDimension', 9, newsTaxonomyTermIds()]);
        _paq.push(['trackPageView']);
      }

      const d=document; const g=d.createElement('script'); const s=d.getElementsByTagName('script')[0];
      g.async=true; g.src=`${u}piwik.min.js`; s.parentNode.insertBefore(g,s);
    })();
  }

  if (Drupal.cookieConsent.initialized()) {
    loadMatomoAnalytics();
  } else {
    Drupal.cookieConsent.loadFunction(loadMatomoAnalytics);
  }
})(jQuery, Drupal);

var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u='//webanalytics.digiaiiris.com/js/';
  _paq.push(['setTrackerUrl', u+'tracker.php']);
  _paq.push(['setSiteId', '141']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.src=u+'piwik.min.js'; s.parentNode.insertBefore(g,s);
})();

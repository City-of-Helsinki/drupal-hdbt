module.exports = async (page, scenario, vp, isReference, browserContext, config) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const { hostname } = config;

  browserContext.addCookies([
    {
      'name': 'cookie-agreed-version',
      'value': '1.1.0',
      'domain': hostname,
      'path': '/',
      'httpOnly': false,
      'secure': false
    },
    {
      'name': 'cookie-agreed',
      'value': '2',
      'domain': hostname,
      'path': '/',
      'httpOnly': false,
      'secure': false
    },
    {
      'name': 'cookie-agreed-categories',
      'value': '%5B%22essential%22%2C%22preference%22%2C%22statistics%22%2C%22marketing%22%2C%22chat%22%5D',
      'domain': hostname,
      'path': '/',
      'httpOnly': false,
      'secure': false
    }
  ]);
};

export default class ClientHelpers {
  static isCookieSet = cookieName => {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');

    // Loop through the cookies to see if desired one is set.
    for (let i = 0; i < cookieArray.length; i++) {
      const cookiePair = cookieArray[i].split('=');
      if (cookiePair[0] === cookieName) {
        return true;
      }
    }
    return false;
  };

  static getCurrentLanguage = () => window.drupalSettings.path.currentLanguage;
}

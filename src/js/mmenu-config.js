document.addEventListener('DOMContentLoaded', () => {
  // Get the burger link element.
  const burger = document.getElementById('menu-hamburger');
  const languageSwitcher = document.getElementById('block-language-switcher');

  // Fire the mmenu plugin.
  /* global Mmenu */
  const menu = new Mmenu('#mobile-navigation', {
    slidingSubmenus: false,
    lazySubmenus: true,
    extensions: ['position-bottom', 'fullscreen'],
    setSelected: {
      hover: true,
      parent: true,
    },
    keyboardNavigation: {
      enable: true,
    },
    navbars: [
      {
        position: 'bottom',
        content: [
          '<div id="mobile-navigation-footer" class="mobile-navigation__footer"></div>',
        ],
      },
    ],
  });

  // Get the mmenu API
  const api = menu.API;

  // Bind the burger icon change to menu opening via API.
  api.bind('open:start', () => {
    burger.setAttribute('aria-expanded', 'true');
    languageSwitcher.classList.remove('scroll-up');
  });

  // Bind the burger icon change to menu closing via API.
  api.bind('close:start', () => {
    burger.setAttribute('aria-expanded', 'false');
  });

  // Adter menu has initialized, copy contents.
  api.bind('initMenu:after', () => {
    // const headerTop = document.getElementById('hdbt-header-top');
  });

  // Get the links from the universal header.
  // const headerTop = document.getElementById('hdbt-header-top');
  //
  // if (headerTop) {
  //   Mobile footer elements.
  // let mobileFooter = document.getElementById('mobile-navigation-footer');
  // mobileFooter = headerTop.contents().clone();
  // }
});

((Drupal) => {
  Drupal.behaviors.mobileLanguageSwitcher = {
    attach(context) {
      if (context !== document || window.mobileLanguageSwitcherInitialized) {
        return;
      }

      const INITIAL = 0;
      const DOWN = 1;
      const UP = 2;
      const doc = document.documentElement;
      const w = window;
      const languageSwitcher = document.querySelector('.language-wrapper');

      let prevScroll = w.scrollY || doc.scrollTop;
      let currentScroll;
      let direction = INITIAL;
      let prevDirection = INITIAL;

      const toggleLanguageSwitcher = (newDirection, curScroll) => {
        if (newDirection === UP && curScroll > languageSwitcher.clientHeight) {
          languageSwitcher.classList.add('scroll-up');
          prevDirection = newDirection;
        } else if (newDirection === DOWN) {
          languageSwitcher.classList.remove('scroll-up');
          prevDirection = newDirection;
        }
      };

      const checkScroll = () => {
        currentScroll = w.scrollY || doc.scrollTop;

        if (currentScroll > prevScroll) {
          direction = UP;
        } else if (currentScroll < prevScroll) {
          direction = DOWN;
        }

        if (direction !== prevDirection) {
          toggleLanguageSwitcher(direction, currentScroll);
        }

        prevScroll = currentScroll;
      };

      if (languageSwitcher) {
        window.addEventListener('scroll', checkScroll, { passive: true });
      }

      window.mobileLanguageSwitcherInitialized = true;
    },
  };
})(Drupal);

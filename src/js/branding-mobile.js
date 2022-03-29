document.addEventListener('DOMContentLoaded', function () {
  const INITIAL = 0;
  const DOWN = 1;
  const UP = 2;
  const doc = document.documentElement;
  const w = window;

  let prevScroll = w.scrollY || doc.scrollTop;
  let currentScroll;
  let direction = INITIAL;
  let prevDirection = INITIAL;

  const languageSwitcher = document.querySelector(
    '[data-hdbt-selector="language-switcher"]'
  );

  const checkScroll = function () {
    /*
     ** Find the direction of scroll
     ** 0 - initial, 1 - up, 2 - down
     */
    currentScroll = w.scrollY || doc.scrollTop;
    if (currentScroll > prevScroll) {
      direction = UP;
    } else if (currentScroll < prevScroll) {
      direction = DOWN;
    }

    // Check if scrolling direction is changed and show the language switcher.
    if (direction !== prevDirection) {
      toggleLanguageSwitcher(direction, currentScroll);
    }
    prevScroll = currentScroll;
  };

  const toggleLanguageSwitcher = function (direction, curScroll) {
    if (direction === UP && curScroll > languageSwitcher.clientHeight) {
      languageSwitcher.classList.add('scroll-up');
      prevDirection = direction;
    } else if (direction === DOWN) {
      languageSwitcher.classList.remove('scroll-up');
      prevDirection = direction;
    }
  };

  if (languageSwitcher) {
    window.addEventListener('scroll', checkScroll);
  }
});

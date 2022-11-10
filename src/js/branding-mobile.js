document.addEventListener('DOMContentLoaded', function startMobileBranding() {
  const INITIAL = 0;
  const DOWN = 1;
  const UP = 2;
  const doc = document.documentElement;
  const w = window;

  let prevScroll = w.scrollY || doc.scrollTop;
  let currentScroll;
  let direction = INITIAL;
  let prevDirection = INITIAL;

  const languageSwitcher = document.querySelector('.language-wrapper');

  function toggleLanguageSwitcher(newDirection, curScroll) {
    if (newDirection === UP && curScroll > languageSwitcher.clientHeight) {
      languageSwitcher.classList.add('scroll-up');
      prevDirection = newDirection;
    } else if (newDirection === DOWN) {
      languageSwitcher.classList.remove('scroll-up');
      prevDirection = newDirection;
    }
  }

  function checkScroll() {
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
  }

  if (languageSwitcher) {
    window.addEventListener('scroll', checkScroll);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const doc = document.documentElement;
  const w = window;

  let prevScroll = w.scrollY || doc.scrollTop;
  let currentScroll;
  let direction = 0;
  let prevDirection = 0;

  const languageSwitcher = document.getElementById('block-language-switcher');

  const checkScroll = function () {
    /*
     ** Find the direction of scroll
     ** 0 - initial, 1 - up, 2 - down
     */
    currentScroll = w.scrollY || doc.scrollTop;
    if (currentScroll > prevScroll) {
      //scrolling up
      direction = 2;
    } else if (currentScroll < prevScroll) {
      //scrolling down
      direction = 1;
    }

    // Check if scrolling direction is changed and show the language switcher.
    if (direction !== prevDirection) {
      toggleLanguageSwitcher(direction, currentScroll);
    }

    prevScroll = currentScroll;
  };

  const toggleLanguageSwitcher = function (direction, curScroll) {
    if (direction === 2 && curScroll > 48) {
      languageSwitcher.classList.add('scroll-up');
      prevDirection = direction;
    } else if (direction === 1) {
      languageSwitcher.classList.remove('scroll-up');
      prevDirection = direction;
    }
  };

  window.addEventListener('scroll', checkScroll);
});

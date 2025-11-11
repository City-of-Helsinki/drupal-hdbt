import LocalStorageManager from './localStorageManager';

// eslint-disable-next-line func-names
(function (Drupal) {
  Drupal.behaviors.closableAnnouncements = {
    attach: function attach() {
      const ANNOUCEMENT = 'js-announcement';
      const ANNOUCEMENT_HIDE = 'js-announcement--hide';
      const DISABLED = 'js-announcement__close--disabled';
      const KEYNAME = 'hidden-helfi-announcements';
      const storageManager = new LocalStorageManager('helfi-settings');

      function addToAnnouncementStorage(announcement) {
        const { uuid } = announcement.dataset;
        if (uuid) {
          // console.log('Hiding uuid', uuid);
          storageManager.addValue(KEYNAME, uuid);
        }
      }

      function closeAnnouncement(announcement) {
        addToAnnouncementStorage(announcement);
        // Set fixed height to allow CSS animation
        announcement.style = `--js-announcement-height: ${announcement.offsetHeight}px`;
        window.setTimeout(() => {
          let focused = false;
          const allAnnouncements = document.querySelectorAll('.announcement:not(.js-announcement--hide)');
          announcement.classList.add(ANNOUCEMENT_HIDE);
          // Moving focus to correct place after closing the announcement.
          // NOTICE: This is very dependent on the html-structure of the header and its components.
          // Go through all announcements and use the uuid to determine which focusable announcement is before
          // the closed announcement.
          for (let i = 0, max = allAnnouncements.length; i < max; i++) {
            if (allAnnouncements[i].dataset.uuid === announcement.dataset.uuid && i > 0) {
              const focusableAnnouncement = allAnnouncements[i - 1].querySelectorAll('.announcement__close, .announcement__link a');
              focusableAnnouncement[focusableAnnouncement.length - 1].focus();
              focused = true;
              break;
            }
          }
          // If there is no more announcements to focus to we need to figure out if we are viewing the page with mobile
          // or desktop navigation. We check if the header-bottom menu is visible to determine this.
          if (focused === false) {
            const desktopMenu = document.querySelector('.header-bottom .desktop-menu > .menu');
            const desktopMenuHidden = window.getComputedStyle(desktopMenu).display === 'none';
            // Depending on the visible menu we move the focus straight to nav-toggle buttons or the menu links if no
            // breadcrumb is set.
            if (desktopMenuHidden === true) {
              // Move the focus on mobile:
              const focusableElements = document.querySelectorAll('.nav-toggle__button, .breadcrumb a:last-of-type');
              focusableElements[focusableElements.length - 1].focus();
            } else {
              // Move the focus on desktop:
              const focusableElements = document.querySelectorAll('.nav-toggle__button, .header-bottom .menu--level-0 > .menu__item:last-child > .menu__link-wrapper :where(a, button), .breadcrumb a:last-of-type');
              focusableElements[focusableElements.length - 1].focus();
            }
          }
        }, 1); // Delay setting class a bit to allow css accept fixed height before animating
      }

      function triggerAnnouncementClose(e) {
        const announcement = e.target.closest(`.${ANNOUCEMENT}`);
        closeAnnouncement(announcement);
      }

      function enableAnnouncementClosing() {
        const disabledAnnouncements = document.querySelectorAll(`.${DISABLED}`);
        for (let i = 0; i < disabledAnnouncements.length; i++) {
          const announcement = disabledAnnouncements[i];
          announcement.addEventListener('click', triggerAnnouncementClose);
          announcement.classList.remove(DISABLED);
        }
      }

      // This can be called from address bar using `javascript:unhideAnnouncements();`
      window.unhideAnnouncements = function unhideAnnouncements() {
        storageManager.removeValue(KEYNAME);
        window.location.reload();
      };

      enableAnnouncementClosing();
    },
  };
})(Drupal);

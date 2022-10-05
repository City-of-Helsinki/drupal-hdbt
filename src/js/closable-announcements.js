'use strict';

(function (Drupal) {
  Drupal.behaviors.closable_announcements = {
    attach: function attach() {
      const ANNOUCEMENT = 'js-announcement';
      const ANNOUCEMENT_HIDE = 'js-announcement--hide';
      const DISABLED = 'js-announcement__close--disabled';
      const KEYNAME = 'hidden-helfi-announcements';

      function enableAnnouncementClosing() {
        const disabledAnnouncements = document.querySelectorAll('.' + DISABLED);
        for (let i = 0; i < disabledAnnouncements.length; i++) {
          const announcement = disabledAnnouncements[i];
          announcement.addEventListener('click', triggerAnnouncementClose);
          announcement.classList.remove(DISABLED);
        }
      }

      function addToAnnouncementStorage(announcement) {
        const uuid = announcement.dataset.uuid;
        if (uuid) {
          let item = window.localStorage.getItem(KEYNAME);
          let itemArray = [];
          if (item) {
            try {
              itemArray = JSON.parse(item);
            } catch (error) {
              console.error(error);
            }
          }
          itemArray.push(uuid);

          console.log('Hiding uuid', uuid);
          window.localStorage.setItem(KEYNAME, JSON.stringify(itemArray));
        }
      }

      function closeAnnouncement(announcement) {
        addToAnnouncementStorage(announcement);
        announcement.style = `--js-announcement-height: ${announcement.offsetHeight}px`; // Set fixed height to allow CSS animation
        window.setTimeout(() => {
          announcement.classList.add(ANNOUCEMENT_HIDE);
        }, 1); // Delay setting class a bit to allow css accept fixed height before animating
      }

      function triggerAnnouncementClose(e) {
        const announcement = e.target.closest('.' + ANNOUCEMENT);
        closeAnnouncement(announcement);
      }

      // This can be called from addressbar using `javascript:unhideAnnouncements();`
      window.unhideAnnouncements = function () {
        window.localStorage.removeItem(KEYNAME);
        window.location.reload();
      };

      enableAnnouncementClosing();
    },
  };
})(Drupal);

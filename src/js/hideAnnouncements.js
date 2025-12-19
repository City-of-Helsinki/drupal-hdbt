(() => {
  const uuidsToHide = JSON.parse(window.localStorage.getItem('helfi-settings'));
  const elements = document.querySelectorAll('.js-announcement');

  if (!uuidsToHide || !('hidden-helfi-announcements' in uuidsToHide) || !elements) {
    return;
  }

  elements.forEach((element) => {
    const { uuid } = element.dataset;
    if (uuidsToHide['hidden-helfi-announcements'].includes(uuid)) {
      element.remove();
    }
  });
})();

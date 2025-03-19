document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.language-link.has-toast');

  function showToast(toast) {
    toast.style.opacity = '1';
    toast.classList.remove('language-toast__closed');
  }

  function closeToast(toast) {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.add('language-toast__closed'), 300);
  }

  function closeAllOpenToasts() {
    document.querySelectorAll('.language-toast:not(.language-toast__closed)').forEach(toast => {
      closeToast(toast);
    });
  }

  function positionToast(button, toast) {
    if (!toast || !toast.classList.contains('language-toast')) {
      return;
    }

    // Get button and toast dimensions and position relative to the viewport.
    const rect = button.getBoundingClientRect();
    const buttonWidth = button.offsetWidth;
    const toastWidth = toast.offsetWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const gutter = 16;

    // Positioning if the toast doesn't fit on the right side.
    if ((viewportWidth - rect.right) < ((toastWidth / 2) - (buttonWidth / 2))) {
      const right = viewportWidth - rect.right - gutter;
      const toastArrowRight = ((viewportWidth - rect.right) - gutter) + (buttonWidth / 2);
      toast.style.left = 'auto';
      toast.style.transform = 'none';
      toast.style.right = `-${right}px`;
      toast.style.setProperty('--toast-arrow-left', 'auto');
      toast.style.setProperty('--toast-arrow-right', `${toastArrowRight}px`);
      toast.style.setProperty('--toast-arrow-transform', '50%');
    }

    // Positioning if the toast doesn't fit on the left side.
    if ((rect.left) < ((toastWidth / 2) - (buttonWidth / 2))) {
      const left = rect.left - gutter;
      const toastArrowLeft = (rect.left - gutter) + (buttonWidth / 2);
      toast.style.left = `-${left}px`;
      toast.style.transform = 'none';
      toast.style.setProperty('--toast-arrow-left', `${toastArrowLeft}px`);
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const toast = button.nextElementSibling;

      if (!toast || !toast.classList.contains('language-toast')) {
        return;
      }

      // If toast is already visible, hide it.
      if (!toast.classList.contains('language-toast__closed')) {
        closeToast(toast);
        return;
      }

      // Hide any other visible toasts before showing a new one.
      document.querySelectorAll('.language-toast:not(.language-toast__closed)').forEach(otherToast => {
        closeToast(otherToast);
      });

      // Position and after that show the toast.
      positionToast(button, toast);
      showToast(toast);
    });
  });

  // Handle resize event to reposition open toasts.
  window.addEventListener('resize', function () {
    document.querySelectorAll('.language-link.has-toast').forEach(button => {
      const toast = button.nextElementSibling;
      if (toast && !toast.classList.contains('language-toast__closed')) {
        positionToast(button, toast);
      }
    });
  });


  document.body.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllOpenToasts();
    }
  });

  // Hide toast when clicking outside.
  document.addEventListener('click', function (event) {
    if (!event.target.matches('.language-link.has-toast') && !event.target.matches('.language-toast')) {
      closeAllOpenToasts();
    }
  });
});

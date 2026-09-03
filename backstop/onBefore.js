module.exports = async (page) => {
  // Simulate the "prefers-reduced-motion: reduce" media query,
  // which is a user setting that reduces animations and transitions.
  // It will provide less distorted test images.
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Load offscreen images early, so they end up in the screenshots.
  await page.addInitScript(() => {
    const loadEarly = () => {
      for (const image of document.querySelectorAll('img[loading="lazy"]')) {
        image.removeAttribute('loading');
      }
    };

    new MutationObserver(loadEarly).observe(document, {
      childList: true,
      subtree: true,
    });

    loadEarly();
  });
};

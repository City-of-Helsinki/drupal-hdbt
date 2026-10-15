module.exports = async (page) => {
  // Wait for images to finish loading before the screenshot is taken.
  await page.evaluate(async () => {
    const maxRetries = 3;
    const retryDelay = 1000;

    const settle = (image) =>
      new Promise((resolve) => {
        if (image.complete) {
          resolve();
          return;
        }
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });

    const bustUrl = (url, attempt) => {
      if (url.startsWith('data:')) {
        return url;
      }
      const busted = new URL(url, document.baseURI);
      busted.searchParams.set('backstop_retry', attempt);
      return busted.href;
    };

    const bustSrcset = (srcset, attempt) => {
      const candidates = [];
      for (const candidate of srcset.split(',')) {
        const [url, ...descriptors] = candidate.trim().split(/\s+/);
        if (url) {
          candidates.push([bustUrl(url, attempt), ...descriptors].join(' '));
        }
      }
      return candidates.join(', ');
    };

    // Retry images that failed while the image style derivative was generated.
    const load = async (image) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        await settle(image);

        if (!image.currentSrc || image.naturalWidth > 0) {
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        if (image.parentElement?.tagName === 'PICTURE') {
          for (const source of image.parentElement.querySelectorAll('source[srcset]')) {
            source.srcset = bustSrcset(source.srcset, attempt);
          }
        }
        if (image.srcset) {
          image.srcset = bustSrcset(image.srcset, attempt);
        }
        if (image.getAttribute('src')) {
          image.src = bustUrl(image.src, attempt);
        }
      }

      await settle(image);
    };

    const pending = [];
    for (const image of document.images) {
      pending.push(load(image));
    }

    // Give up on images that never resolve, like unreachable external hosts.
    await Promise.race([
      Promise.all(pending),
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]);
  });
};

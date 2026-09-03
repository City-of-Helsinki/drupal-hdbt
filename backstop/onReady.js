module.exports = async (page) => {
  // Wait for images to finish loading before the screenshot is taken.
  await page.evaluate(async () => {
    const pending = [];

    for (const image of document.images) {
      if (image.complete) {
        continue;
      }

      pending.push(
        new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        }),
      );
    }

    // Give up on images that never resolve, like unreachable external hosts.
    await Promise.race([
      Promise.all(pending),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  });
};

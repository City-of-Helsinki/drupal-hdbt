/**
 * PostCSS plugin to strip @charset rules.
 *
 * @return {object} PostCSS plugin
 */
export const skipCharsetPlugin = () => ({
  postcssPlugin: 'internal:charset-removal',
  AtRule: {
    charset: (atRule) => {
      atRule.remove();
    }
  }
});

/**
 * PostCSS plugin to strip inline comments from distributed CSS.
 * Inline comments are comments on the same line as code.
 *
 * @return {object} PostCSS plugin
 */
export const stripInlineComments = () => ({
  postcssPlugin: 'strip-inline-comments',
  Once(root) {
    root.walkComments(comment => {
      if (comment.raws.inline) {
        comment.remove();
      }
    });
  }
});

/**
 * Runs promises with a concurrency limit.
 *
 * @param {Function[]} tasks - Array of functions that return promises
 * @param {number} limit - Maximum number of promises to run concurrently
 * @return {Promise<Array>} A promise that resolves to an array of results when all tasks are completed
 */
export async function runWithConcurrency(tasks, limit) {
  const queue = [...tasks];
  const results = [];

  const next = async () => {
    const task = queue.shift();
    if (!task) return;

    const res = await task();
    results.push(res);

    return next();
  };

  await Promise.all(Array.from({ length: limit }, () => next()));
  return results;
}

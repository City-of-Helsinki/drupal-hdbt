const fs = require('fs/promises');

/**
 * PostCSS plugin to strip @charset rules.
 *
 * @return {object} PostCSS plugin
 */
const skipCharsetPlugin = () => ({
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
const stripInlineComments = () => ({
  postcssPlugin: 'strip-inline-comments',
  Once (root) {
    root.walkComments(comment => {
      if (comment.raws.inline) {
        comment.remove();
      }
    });
  }
});
stripInlineComments.postcss = true;

/**
 * Plugin to strip sourceMappingURL comments from specific JS files.
 *
 * @param {string[]} targets Array of file paths (in dist) to clean
 * @return {import('vite').Plugin}
 */
const stripSourceMapComments = (targets) => ({
  name: 'strip-source-map-comments',
  apply: 'build',
  async closeBundle() {
    await Promise.all(
      targets.map(async (file) => {
        try {
          const content = await fs.readFile(file, 'utf-8');
          const updated = content.replace(/\/\/# sourceMappingURL=.*?(\r?\n)?$/gm, '');
          await fs.writeFile(file, updated, 'utf-8');
        } catch (err) {
          console.warn(`[strip-source-map-comments] Failed to process ${file}`, err);
        }
      })
    );
  }
});

module.exports = {
  skipCharsetPlugin,
  stripInlineComments,
  stripSourceMapComments,
};

const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssNesting = require('postcss-nesting');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');
const { stripInlineComments, skipCharsetPlugin } = require('./postcss.plugins');

// PostCSS configuration.
module.exports = {
  parser: 'postcss-scss',

  // Plugins for PostCSS.
  plugins: [
    postcssImport(),
    postcssPresetEnv({ // Convert modern CSS into something most browsers can understand.
      stage: 2, // Use stage 2 CSS features.
      preserve: true, // Keep the modern CSS as-is and add fallbacks if needed.
      features: {
        'logical-properties-and-values': false,
      }, // Disable the conversion of CSS logical properties such as padding-inline.
    }),
    postcssNested(), // Unwrap nested rules like how Sass does it.
    postcssNesting(), // Nest style rules inside each other, following the CSS Nesting specification.
    stripInlineComments(), // Strip inline comments from the distributed CSS.
    skipCharsetPlugin(), // Remove all @charset rules
    cssnano({
      preset: 'default',
    }) // Minify CSS
  ]
};

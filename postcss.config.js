const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  parser: "postcss-scss",
  plugins: [
    // Plugins for PostCSS
    ["autoprefixer", { sourceMap: isDev }], // Parses CSS and adds vendor prefixes.
    "postcss-preset-env", // Convert modern CSS into something most browsers can understand.
    "postcss-extend", // Minimize the number of repeat selectors and rules you write in CSS.
    "postcss-nested", // Unwrap nested rules like how Sass does it.
    "postcss-nesting", // Nest style rules inside each other, following the CSS Nesting specification.
    "postcss-combine-media-query", // Looks for equal media query rules and appends them combined.
    "postcss-strip-inline-comments", // Strip inline comments.
  ],
};

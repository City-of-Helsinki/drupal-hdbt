import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { optimize } from 'svgo';

/**
 * Build the icon sprite and related CSS and JSON.
 *
 * @param {Object} opts - Options
 * @param {string} [opts.inputPattern] - Glob pattern to find SVGs
 * @param {string} [opts.outDir] - Output directory
 * @param {string} [opts.spriteOut] - Relative sprite output path
 * @param {string} [opts.cssOut] - Relative CSS output path
 * @param {string} [opts.ckeditorCssOut] - Relative CKEditor CSS output path
 * @param {string} [opts.jsonOut] - Relative JSON output path
 * @param {string} [opts.iconClass] - Icon CSS class prefix
 * @param {string} [opts.spriteBaseUrl] - URL of the folder that contains the sprite
 */
export default async function themeBuilderIcons(opts = {}) {
  const {
    inputPattern,
    outDir,
    spriteOut,
    cssOut,
    ckeditorCssOut,
    jsonOut,
    iconClass,
    spriteBaseUrl = '../../../../contrib/hdbt/dist',
  } = opts;

  const files = fs.globSync(inputPattern).sort();

  if (!files.length) {
    console.warn('⚠️ No SVG files found.');
    return;
  }

  const iconNames = files.map((f) => path.basename(f, '.svg'));

  // Optimize each icon and prefix its ids with the icon name.
  const icons = files.map((file, i) => {
    const name = iconNames[i];
    const { data } = optimize(fs.readFileSync(file, 'utf-8'), {
      path: file,
      plugins: ['preset-default', 'removeTitle', { name: 'prefixIds', params: { prefix: name, delim: '__' } }],
    });
    const rootTag = data.match(/<svg[^>]*>/)[0];
    const inner = data.slice(data.indexOf(rootTag) + rootTag.length).replace(/<\/svg>\s*$/, '');

    const rootAttrs = Object.fromEntries([...rootTag.matchAll(/\s([\w:-]+)="([^"]*)"/g)].map(([, a, v]) => [a, v]));

    // Build the viewBox from the icon size when it is missing.
    if (!rootAttrs.viewBox && rootAttrs.width && rootAttrs.height) {
      rootAttrs.viewBox = `0 0 ${parseFloat(rootAttrs.width)} ${parseFloat(rootAttrs.height)}`;
    }

    // Keep the root attributes except size, id and namespaces.
    const attrs = Object.entries(rootAttrs)
      .filter(([attr]) => !['width', 'height', 'id', 'xmlns', 'xmlns:xlink'].includes(attr))
      .map(([attr, value]) => ` ${attr}="${value}"`)
      .join('');
    return `<svg${attrs} id="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  });

  const spriteContent =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '<style>:root>svg{display:none}:root>svg:target{display:block}</style>' +
    icons.join('') +
    '</svg>';

  const hash = createHash('md5').update(spriteContent).digest('hex').slice(-5);
  const spriteFilename = spriteOut.replace(/\.svg$/, `-${hash}.svg`);

  const spritePath = path.join(outDir, spriteFilename);
  fs.mkdirSync(path.dirname(spritePath), { recursive: true });
  fs.writeFileSync(spritePath, spriteContent);

  const cssRoot =
    `:root{${iconNames
      .map(
        (name) =>
          `--${iconClass}-icon--${name}:url(${spriteBaseUrl}/${spriteFilename}#${name})`
      )
      .join(';')}}`;

  const cssClasses = iconNames
    .map(
      (name) =>
        `.${iconClass}-icon--${name},[data-hds-icon-start='${name}']{--url:var(--${iconClass}-icon--${name})}`
    )
    .join('');

  const iconUrlCSS =
    `.${iconClass}-icon,[data-hds-icon-start]::before{` +
    '-webkit-mask-image:var(--url);' +
    'mask-image:var(--url)}';

  const fullCSS = cssRoot + cssClasses + iconUrlCSS;

  const iconsCSSPath = path.join(outDir, cssOut);
  fs.mkdirSync(path.dirname(iconsCSSPath), { recursive: true });
  fs.writeFileSync(iconsCSSPath, fullCSS);

  const ckeditorCSS = iconNames
    .map(
      (name) =>
        `[data-hds-icon-start=${name}]::before,[data-selected-icon=${name}]::before{` +
        `-webkit-mask-image:var(--${iconClass}-icon--${name});` +
        `mask-image:var(--${iconClass}-icon--${name})}`
    )
    .join('');

  const ckeditorCSSPath = path.join(outDir, ckeditorCssOut);
  fs.mkdirSync(path.dirname(ckeditorCSSPath), { recursive: true });
  fs.writeFileSync(ckeditorCSSPath, ckeditorCSS);

  const jsonPath = path.join(outDir, jsonOut);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(iconNames));
}

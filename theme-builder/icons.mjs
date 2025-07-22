import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import md5 from 'md5';
import SVGSpriter from 'svg-sprite';

/**
 * Build HDBT icon sprite and related CSS/JSON.
 *
 * @param {Object} opts - Options
 * @param {string} [opts.inputPattern] - Glob pattern to find SVGs
 * @param {string} [opts.outDir] - Output directory
 * @param {string} [opts.spriteOut] - Relative sprite output path
 * @param {string} [opts.cssOut] - Relative CSS output path
 * @param {string} [opts.ckeditorCssOut] - Relative CKEditor CSS output path
 * @param {string} [opts.jsonOut] - Relative JSON output path
 * @param {string} [opts.iconClass] - Icon CSS class prefix
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
  } = opts;

  const files = globSync(inputPattern);

  if (!files.length) {
    console.warn('⚠️ No SVG files found.');
    return;
  }

  const spriter = new SVGSpriter({
    mode: {
      stack: {
        dest: '.',
        sprite: spriteOut,
        rootviewbox: false,
      },
    },
  });

  files.forEach((file) => {
    spriter.add(path.resolve(file), null, fs.readFileSync(file, 'utf-8'));
  });

  await new Promise((resolve, reject) => {
    spriter.compile((error, result) => {
      if (error) return reject(error);

      const { spriteFilename, spriteContent } =
      Object.entries(result)

        .flatMap(([, resources]) =>
          Object.entries(resources).map(([, { contents }]) => {
            const hash = md5(contents).slice(-5);
            const filename = spriteOut.replace(/\.svg$/, `-${hash}.svg`);
            return { spriteFilename: filename, spriteContent: contents };
          })
        )[0] || {};

      const spritePath = path.join(outDir, spriteFilename);
      fs.mkdirSync(path.dirname(spritePath), { recursive: true });
      fs.writeFileSync(spritePath, spriteContent);

      const iconNames = files.map((f) => path.basename(f, '.svg'));

      const cssRoot =
        `:root{${iconNames
          .map(
            (name) =>
              `--${iconClass}-icon--${name}:url(../../../../contrib/hdbt/dist/${spriteFilename}#${name})`
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

      const hdbtIconsCSSPath = path.join(outDir, cssOut);
      fs.mkdirSync(path.dirname(hdbtIconsCSSPath), { recursive: true });
      fs.writeFileSync(hdbtIconsCSSPath, fullCSS);

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
      resolve();
    });
  });
}

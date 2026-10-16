# Theme builder

Builds the CSS, JavaScript, React apps, icon sprite and static files for Drupal themes and modules.

## Usage

Add the builder to the theme or module dependencies with a path relative to hdbt.

```json
"dependencies": {
  "@hdbt/theme-builder": "file:../../contrib/hdbt/theme-builder"
}
```

Set `install-links=true` in the `.npmrc` so npm copies the builder and installs only its dependencies.

`npm install` keeps the builder copy from the lockfile. Install it by path in a `preinstall` script so every `npm i` picks up the builder changes.

```json
"scripts": {
  "preinstall": "npm install ../../contrib/hdbt/theme-builder --loglevel=silent"
}
```

| Package | `preinstall` path |
| --- | --- |
| hdbt | `./theme-builder` |
| hdbt_admin | `../hdbt/theme-builder` |
| `hdbt_subtheme` | `../../contrib/hdbt/theme-builder` |
| `helfi_platform_config` | `../../../themes/contrib/hdbt/theme-builder` |
| `helfi_calculator` | `../../../../../themes/contrib/hdbt/theme-builder` |

`npm i` and `npm ci` run the `preinstall` before they install anything. The `preinstall` does not loop, since npm runs install scripts only for `npm install` without arguments.

Create a `theme-builder.mjs` file in the theme or module root.

```js
import path from 'path';
import { buildAll, watchAndBuild } from '@hdbt/theme-builder/builder';

const isDev = process.argv.includes('--dev');
const outDir = path.resolve('dist');

const buildArguments = {
  outDir,
  iconsConfig: {
    inputPattern: 'src/icons/**/*.svg',
    outDir,
    spriteOut: 'icons/sprite.svg',
    cssOut: 'css/icons.css',
    ckeditorCssOut: 'css/ckeditor-icons.css',
    jsonOut: 'icons.json',
    iconClass: 'hel',
  },
  staticFiles: [
    ['src/fonts/**/*.{woff2,woff}', `${outDir}/fonts`],
  ],
  jsConfig: { jsFiles: { 'nav-toggle': 'src/js/nav-toggle.js' }, isDev, outDir },
  reactConfig: { reactApps: { 'news-archive': './src/js/react/apps/news-archive/index.tsx' }, isDev, outDir },
  cssConfig: { styles: [['src/scss/styles.scss', 'css/styles.min.css']], isDev, outDir },
};

if (process.argv.includes('--watch')) {
  watchAndBuild({ buildArguments, watchPaths: ['src/js', 'src/scss'] });
} else {
  buildAll(buildArguments).catch((e) => {
    console.error('❌ Build failed:', e);
    process.exit(1);
  });
}
```

Run the build from the theme root.

```sh
node theme-builder.mjs            # Production build
node theme-builder.mjs --dev      # Development build with source maps
node theme-builder.mjs --watch    # Build and rebuild on changes
```

## Configuration

Every config except `outDir` is optional. A missing or empty config skips that step.

| Option | Builds |
| --- | --- |
| `outDir` | Output directory, emptied before each build |
| `iconsConfig` | Hashed SVG sprite, icon CSS, CKEditor icon CSS and icon name JSON |
| `staticFiles` | Copies `[from, to]` pairs, globs copy into the `to` directory |
| `jsConfig.jsFiles` | Vanilla JS bundles as `js/<name>.min.js` |
| `reactConfig.reactApps` | React app bundles as `js/<name>.min.js`, needs `tsconfig.json` in the theme root |
| `cssConfig.styles` | SCSS `[input, output]` pairs compiled to minified CSS |

A failing file fails the build with exit code 1. Watch mode logs the error and keeps watching.

### Paths outside hdbt

The defaults assume a theme under `themes/contrib` or `themes/custom` that shares packages and the icon sprite with hdbt. Override them for a module or another layout.

| Option | Default | Purpose |
| --- | --- | --- |
| `cssConfig.nodePaths`, `jsConfig.nodePaths`, `reactConfig.nodePaths` | `['../../contrib/hdbt/node_modules']` | Extra package directories for imports, relative to the working directory |
| `iconsConfig.spriteBaseUrl` | `'../../../../contrib/hdbt/dist'` | URL of the folder that contains the sprite |

A module in `public/modules/custom/my_module` that uses hdbt packages and its own sprite:

```js
const nodePaths = ['../../../themes/contrib/hdbt/node_modules'];

const jsConfig = { jsFiles, isDev, outDir, nodePaths };
const cssConfig = { styles, isDev, outDir, nodePaths };
const iconsConfig = {
  inputPattern: 'src/icons/**/*.svg',
  outDir,
  spriteOut: 'icons/sprite.svg',
  cssOut: 'css/icons.css',
  ckeditorCssOut: 'css/ckeditor-icons.css',
  jsonOut: 'icons.json',
  iconClass: 'my-module',
  spriteBaseUrl: '/modules/custom/my_module/dist',
};
```

Browser targets come from the `browserslist` in this package.

## Sandbox

The `sandbox` command runs a command in a `node:24-alpine` container without network access. Use it in the theme scripts.

```json
"scripts": {
  "build": "sandbox node theme-builder.mjs",
  "dev": "sandbox node theme-builder.mjs --watch --dev",
  "lint:js": "sandbox biome lint src/js/"
}
```

Inside a Drupal project the container mirrors the `public` folder layout and mounts `public/themes/contrib/hdbt` read-only. Environment variables prefixed with `HDBT_` are forwarded without the prefix.

## Exports

* `@hdbt/theme-builder/builder` for `buildAll` and `watchAndBuild`
* `@hdbt/theme-builder/css`, `/js`, `/icons` and `/copy` for single build steps
* `@hdbt/theme-builder/biome` for the shared Biome config

## Updating dependencies

The themes and modules get the builder dependencies through the builder. An hdbt release updates them in every Drupal instance through the `Update config` action.

1. Raise the minimum of the range in `package.json`. The consumers keep the locked version while it satisfies the range.
2. Run `npm install` and `npm test`.
3. Build hdbt, hdbt_admin, `helfi_platform_config` and a subtheme, and compare `dist/`.
4. Release hdbt.

The `overrides` in this `package.json` apply to the builder tests only. Override a package for the consumers in their own `package.json`.

See [HDBT subtheme dependencies](https://github.com/City-of-Helsinki/drupal-helfi-platform/blob/main/documentation/theme-dependencies.md) for the subtheme updates and overrides.

## Development

Tests run in a `node:24-alpine` container through `tools/sandbox.sh` and need Docker. The builder has its own lockfile for the tests.

```sh
cd theme-builder
npm ci
npm test
```

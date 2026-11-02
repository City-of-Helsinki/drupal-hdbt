import fs from 'node:fs';
import path from 'node:path';
import { buildAll, watchAndBuild } from '@hdbt/theme-builder/builder';

const __dirname = path.resolve();
const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');
const watchPaths = ['src/js', 'src/scss'];
const outDir = path.resolve(__dirname, 'dist');

// React apps.
const reactApps = {
  'fixture-app': './src/js/react/apps/fixture-app/index.tsx',
};

// Vanilla JS files.
const jsFiles = fs.globSync('src/js/**/*.js').reduce((acc, file) => ({
  ...acc, [path.parse(file).name]: file
}), {});

// SCSS files.
const styles = [
  ['src/scss/styles.scss', 'css/styles.min.css'],
];

// Static files.
const staticFiles = [
  ['src/static/static.js', `${outDir}/js/static/static.js`],
  ['src/fonts/**/*.{woff2,woff}', `${outDir}/fonts`],
];

// Builder configurations.
const reactConfig = { reactApps, isDev, outDir };
const jsConfig = { jsFiles, isDev, outDir };
const cssConfig = { styles, isDev, outDir };
const iconsConfig = {
  inputPattern: 'icons/*.svg',
  outDir,
  spriteOut: 'icons/sprite.svg',
  cssOut: 'css/icons.css',
  ckeditorCssOut: 'css/ckeditor-icons.css',
  jsonOut: 'icons.json',
  iconClass: 'hel',
};
const buildArguments = { outDir, iconsConfig, staticFiles, jsConfig, reactConfig, cssConfig };

if (isWatch) {
  watchAndBuild({
    buildArguments,
    watchPaths,
  });
} else {
  buildAll(buildArguments).catch((e) => {
    console.error('❌ Build failed:', e);
    process.exit(1);
  });
}

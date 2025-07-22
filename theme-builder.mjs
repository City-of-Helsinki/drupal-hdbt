import path from 'path';
import { globSync } from 'glob';
import { buildAll, watchAndBuild } from '@hdbt/theme-builder/builder';

const __dirname = path.resolve();
const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');
const watchPaths = ['src/js', 'src/scss'];
const outDir = path.resolve(__dirname, 'dist');

// React apps.
const reactApps = {
  'district-and-project-search': './src/js/react/apps/district-and-project-search/index.tsx',
  'job-search': './src/js/react/apps/job-search/index.tsx',
  'linkedevents': './src/js/react/apps/linkedevents/index.tsx',
  'school-search': './src/js/react/apps/school-search/index.tsx',
  'news-archive': './src/js/react/apps/news-archive/index.tsx',
  'health-station-search': './src/js/react/apps/health-station-search/index.tsx',
  'maternity-and-child-health-clinic-search': './src/js/react/apps/maternity-and-child-health-clinic-search/index.tsx',
  'ploughing-schedule': './src/js/react/apps/ploughing-schedule/index.tsx',
};

// Vanilla JS files.
const jsFiles = globSync('./src/js/**/*.js', {
  ignore: [
    'src/js/accordion/accordion-item.js',
    'src/js/accordion/events.js',
    'src/js/helfi-accordion.js',
    'src/js/accordion/state.js',
    'src/js/accordion/translations.js',
    'src/js/localStorageManager.js',
    'src/js/calculator/**/tests/**',
  ],
}).reduce((acc, file) => ({
  ...acc, [path.parse(file).name]: file
}), {});

// SCSS files.
const styles = [
  ['src/scss/styles.scss', 'css/styles.min.css'],
  ['src/scss/nav-local.scss', 'css/nav_local.min.css'],
  ['src/scss/nav-global.scss', 'css/nav_global.min.css'],
  ['src/scss/nav-toggle.scss', 'css/nav_toggle.min.css'],
  ['src/scss/ckeditor.scss', 'css/ckeditor.min.css'],
  ['src/scss/color-palette.scss', 'css/color-palette.min.css'],
  ['src/scss/environment-indicator.scss', 'css/environment-indicator.min.css'],
];

// Static files.
const staticFiles = [
  ['node_modules/hyphenopoly/min/Hyphenopoly_Loader.js', `${outDir}/js/hyphenopoly/Hyphenopoly_Loader.js`],
  ['node_modules/hyphenopoly/min/Hyphenopoly.js', `${outDir}/js/hyphenopoly/Hyphenopoly.js`],
  ['node_modules/hyphenopoly/min/patterns/fi.wasm', `${outDir}/js/hyphenopoly/patterns/fi.wasm`],
  ['node_modules/hyphenopoly/min/patterns/sv.wasm', `${outDir}/js/hyphenopoly/patterns/sv.wasm`],
  ['node_modules/hyphenopoly/min/patterns/en-us.wasm', `${outDir}/js/hyphenopoly/patterns/en-us.wasm`],
  ['node_modules/focus-trap/dist/focus-trap.umd.min.js', `${outDir}/js/focus-trap/focus-trap.min.js`],
  ['node_modules/tabbable/dist/index.umd.min.js', `${outDir}/js/tabbable/tabbable.min.js`],
  ['src/fonts/**/*.{woff,eot,ttf,svg}', `${outDir}/fonts`],
];

// Builder configurations.
const reactConfig = { reactApps, isDev, outDir };
const jsConfig = { jsFiles, isDev, outDir };
const cssConfig   = { styles, isDev, outDir };
const iconsConfig = {
  inputPattern: 'src/icons/**/*.svg',
  outDir,
  spriteOut: 'icons/sprite.svg',
  cssOut: 'css/hdbt-icons.css',
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

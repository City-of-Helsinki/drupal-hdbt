import chokidar from 'chokidar';
import { rmSync } from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
/* eslint-disable import/extensions */
import themeBuilderIcons from './icons.mjs';
import themeBuilderCopy from './copy.mjs';
import { buildVanillaJs, buildReactApps } from './js.mjs';
import { themeBuilderCss, findStylesForFile } from './css.mjs';
/* eslint-enable import/extensions */

// Time the builds.
async function withTimer(label, fn) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = Math.round(end - start);
  console.warn(`⏱️ ${label} built in ${duration}ms`);
  return result;
}

// Empty the dist folder.
const cleanDist = (outDir) => {
  console.warn('🧹 Cleaning dist...');
  rmSync(outDir, { recursive: true, force: true });
};

/**
 * Build everything once.
 *
 * @param {Object}  config                   Build options
 * @param {string}  config.outDir            Output directory
 * @param {Object} [config.iconsConfig]      Icon‑sprite options (optional)
 * @param {Array}  [config.staticFiles=[]]   Static files to copy (optional)
 * @param {Object}  config.jsConfig          JS‑build options
 * @param {Object}  config.reactConfig       React‑build options
 * @param {Object}  config.cssConfig         CSS‑build options
 * @return {Promise<void>}                  Resolves when all tasks finish
 */
export async function buildAll(config) {
  const { outDir, iconsConfig, staticFiles, jsConfig, reactConfig, cssConfig } = config;

  await withTimer('Everything', async () => {
    cleanDist(outDir);

    // Run only when an iconsConfig object is provided
    if (iconsConfig && Object.keys(iconsConfig)[0].length) {
      await withTimer('Icons', () => themeBuilderIcons(iconsConfig));
    }

    // Run only when staticFiles is a non‑empty array
    if (staticFiles && staticFiles.length) {
      await withTimer('Static', () => themeBuilderCopy({ staticFiles }));
    }

    if (jsConfig && Object.keys(jsConfig)[0].length) {
      await withTimer('JS', () => buildVanillaJs(jsConfig));
    }

    if (reactConfig && Object.keys(reactConfig)[0].length) {
      await withTimer('React', () => buildReactApps(reactConfig));
    }

    if (cssConfig && Object.keys(cssConfig)[0].length) {
      await withTimer('CSS', () => themeBuilderCss(cssConfig));
    }
  });
}

/**
 * Watch src folders and rebuild on change.
 */
export function watchAndBuild({
  buildArguments,
  watchPaths = ['src/js', 'src/scss'],
}) {
  buildAll(buildArguments).catch((e) => {
    console.error('❌ Build failed:', e);
    process.exit(1);
  }).then(() => console.warn('\n👀 Watching for changes…'));

  const watcher = chokidar.watch(watchPaths, {
    ignored: /node_modules|dist|theme-buidler/,
    ignoreInitial: true,
  });

  const { styles, ...cssConfig } = buildArguments.cssConfig;
  const { ...jsConfig } = buildArguments.jsConfig;
  const { ...reactConfig } = buildArguments.reactConfig;

  watcher.on('all', (event, filePath) => {
    console.warn(`🔄 ${event}: ${filePath}`);

    const ext = path.extname(filePath);
    if (ext === '.scss') {
      const matched = findStylesForFile({ filePath, styles });
      const cfg = matched.length ? { ...cssConfig, styles: matched }
        : { ...cssConfig, styles };
      withTimer('CSS', () => themeBuilderCss(cfg));
    } else if (ext === '.js') {
      buildVanillaJs(jsConfig).then(() => console.warn('✅ Rebuilt JS.'));
    } else if (['.ts', '.tsx', '.jsx'].includes(ext)) {
      buildReactApps(reactConfig).then(() => console.warn('✅ Rebuilt React.'));
    }
  });
}

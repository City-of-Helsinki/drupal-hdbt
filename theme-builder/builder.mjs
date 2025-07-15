import chokidar from 'chokidar';
import { rmSync } from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
/* eslint-disable import/extensions */
import themeBuilderIcons from './icons.mjs';
import themeBuilderCopy from './copy.mjs';
import themeBuilderJs from './js.mjs';
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
 * @param {Object}  config.cssConfig         CSS‑build options
 * @return {Promise<void>}                  Resolves when all tasks finish
 */
export async function buildAll(config) {
  const { outDir, iconsConfig, staticFiles, jsConfig, cssConfig } = config;

  await withTimer('Everything', async () => {
    cleanDist(outDir);

    // Run only when an iconsConfig object is provided
    if (iconsConfig) {
      await withTimer('Icons', () => themeBuilderIcons(iconsConfig));
    }

    // Run only when staticFiles is a non‑empty array
    if (staticFiles && staticFiles.length) {
      await withTimer('Static', () => themeBuilderCopy({ staticFiles }));
    }

    await withTimer('JS', () => themeBuilderJs(jsConfig));
    await withTimer('CSS', () => themeBuilderCss(cssConfig));
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
    ignored: /node_modules|dist/,
    ignoreInitial: true,
  });

  const { styles, ...cssConfig } = buildArguments.cssConfig;
  const { ...jsConfig } = buildArguments.jsConfig;

  watcher.on('all', (event, filePath) => {
    console.warn(`🔄 ${event}: ${filePath}`);

    const ext = path.extname(filePath);
    if (ext === '.scss') {
      const matched = findStylesForFile({ filePath, styles });
      const cfg = matched.length ? { ...cssConfig, styles: matched }
        : { ...cssConfig, styles };
      withTimer('CSS', () => themeBuilderCss(cfg));
    } else if (['.js', '.ts', '.tsx', '.jsx'].includes(ext)) {
      themeBuilderJs(jsConfig).then(() => console.warn('✅ Rebuilt JS.'));
    }
  });
}

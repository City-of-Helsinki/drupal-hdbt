import path from 'node:path';
import fs from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';
import { cpus } from 'node:os';
import cliProgress from 'cli-progress';

import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import { stripInlineComments, skipCharsetPlugin, runWithConcurrency } from './css.plugins.mjs';
import pkg from './package.json' with { type: 'json' };

/**
 * Builds all CSS files in parallel using Sass & PostCSS.
 *
 * @param {Array<[string, string]>} styles - list of [input.scss, output.css] pairs
 * @param {boolean} isDev - true if development mode
 * @param {string} outDir - output directory
 * @param {string[]} [nodePaths] - extra package directories relative to the working directory
 */
export async function themeBuilderCss({ styles, isDev, outDir, nodePaths = ['../../contrib/hdbt/node_modules'] }) {
  console.warn('🎨 Building CSS…');

  const debugVar = `$debug_mode: ${isDev};\n`;
  const queue = styles.slice();
  const failed = [];
  const packagePaths = ['node_modules', ...nodePaths.map((nodePath) => path.resolve(nodePath))];

  stripInlineComments.postcss = true;

  // Configure PostCSS with desired plugins
  const postcssConfig = {
    plugins: [
      postcssImport({ path: packagePaths }),
      postcssPresetEnv({
        browsers: pkg.browserslist,
        stage: 2,
        preserve: true,
        features: { 'logical-properties-and-values': false }
      }),
      stripInlineComments(),
      skipCharsetPlugin(),
      cssnano({ preset: ['default', { overrideBrowserslist: pkg.browserslist }] })
    ]
  };

  // Progress bar for visual feedback
  const progressBar = new cliProgress.SingleBar({
    format: '⏳ CSS [{bar}] {percentage}% | {value}/{total} files',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);

  progressBar.start(queue.length, 0);

  // Create tasks for each SCSS → CSS job
  const tasks = styles.map(([input, output]) => async () => {
    const outFile = path.join(outDir, output);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    if (!fs.existsSync(input)) {
      console.warn(`⚠️ Skipping missing file: ${input}`);
      progressBar.increment();
      return;
    }

    try {
      // Prepend debug variable & compile SCSS → CSS
      const contentWithDebug = `${debugVar}@import "${path.resolve(input)}";`;

      const result = sass.compileString(contentWithDebug, {
        style: 'compressed',
        loadPaths: ['src/scss', ...packagePaths],
        quietDeps: true,
        silenceDeprecations: ['import'],
        sourceMap: isDev,
        charset: false
      });

      // Process CSS through PostCSS
      const postcssResult = await postcss(postcssConfig.plugins).process(result.css, {
        from: undefined
      });

      // Write final CSS to output
      fs.writeFileSync(outFile, postcssResult.css, 'utf8');
    } catch (e) {
      console.error(`❌ Error building ${input}:`, e.message);
      failed.push(input);
    }

    progressBar.increment();
  });

  const concurrency = cpus().length;

  // Run tasks with concurrency limit (one per CPU core)
  await runWithConcurrency(tasks, concurrency);
  progressBar.stop();

  if (failed.length) {
    throw new Error(`CSS build failed for ${failed.join(', ')}`);
  }
}

/**
 * Finds which style(s) match a given file path.
 *
 * @param {string} filePath - the file path to check
 * @param {Array<[string, string]>} styles - list of [input.scss, output.css] pairs
 * @return {Array<[string, string]>} Array of style pairs that match the given file path
 */
export async function findStylesForFile({ filePath, styles }) {
  // Filter styles for exact file path match
  return styles.filter(([input]) =>
    path.resolve(input) === path.resolve(filePath)
  );
}

import path from 'path';
import fs from 'fs';
import * as sass from 'sass';
import postcss from 'postcss';
import { cpus } from 'os';
import cliProgress from 'cli-progress';

import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import { stripInlineComments, skipCharsetPlugin, runWithConcurrency } from './themeBuilder.css.plugins.mjs';

/**
 * Builds all CSS files in parallel using Sass & PostCSS.
 *
 * @param {boolean} isDev - true if development mode
 * @param {Array<[string, string]>} styles - list of [input.scss, output.css] pairs
 * @param {string} outDir - output directory
 */
export async function themeBuilderCss({ isDev, styles, outDir }) {
  console.warn('🎨 Building CSS…');

  const debugVar = `$debug_mode: ${isDev};\n`;
  const queue = styles.slice();

  stripInlineComments.postcss = true;

  // Configure PostCSS with desired plugins
  const postcssConfig = {
    parser: 'postcss-scss',
    plugins: [
      postcssImport(),
      postcssPresetEnv({
        stage: 2,
        preserve: true,
        features: { 'logical-properties-and-values': false }
      }),
      postcssNested(),
      postcssNesting(),
      stripInlineComments(),
      skipCharsetPlugin(),
      cssnano({ preset: 'default' })
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
        loadPaths: ['src/scss', 'node_modules'],
        quietDeps: true,
        silenceDeprecations: ['import', 'mixed-decls'],
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
    }

    progressBar.increment();
  });

  const concurrency = cpus().length;

  // Run tasks with concurrency limit (one per CPU core)
  await runWithConcurrency(tasks, concurrency);
  progressBar.stop();
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

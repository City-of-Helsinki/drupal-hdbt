import esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'module';
import { minify } from 'terser';

/**
 * Removes "use strict" directives from a JS file.
 *
 * @param {string} file - Path to the JS file to process.
 * @return {Promise<void>} - Resolves when the file is written.
 * @see: https://www.drupal.org/i/3336143
 */
async function stripUseStrict(file) {
  const content = await fs.readFile(file, 'utf8');
  const stripped = content.replace(/["']use strict["'];?/g, '');
  await fs.writeFile(file, stripped, 'utf8');
}

/**
 * Reverts renamed Drupal global identifiers back to 'Drupal' after bundling.
 *
 * Some bundlers (f.e. Esbuild, SWC, Rollup) renames the `Drupal` parameter
 * in IIFEs to avoid collisions when transpiling arrow functions into
 * `function` syntax, even if the reserved list includes 'Drupal'.
 *
 * This function fixes such unintended renaming by replacing occurrences of
 * `Drupal2` with `Drupal` in the bundled output and then re-minifies the file
 * to clean up formatting.
 *
 * We need this because the Drupal locale system relies on the global Drupal
 * object being named exactly Drupal (e.g., Drupal.t()). Renaming it would
 * prevent the locale module from finding translations and loading them
 * into the window.drupalTranslations variable.
 *
 * @param {string} file - Path to the JS file to process.
 * @param {boolean} isDev - true if development mode
 * @return {Promise<void>} - Resolves when the file is written.
 *
 * @see https://github.com/evanw/esbuild/blob/492e299ce6fa15ee237234887711e3f461fff415/internal/renamer/renamer.go#L580
 */
async function revertDrupalGlobal(file, isDev = false) {
  const content = await fs.readFile(file, 'utf8');
  const replaced = content.replace(
    /\b(Drupal|drupalSettings)\d+\b/g,
    '$1'
  );
  const { code } = await minify(replaced, {
    compress: false,
    ecma: 2020,
    format: {
      comments: false,
    },
    mangle: {
      reserved: ['Drupal', 'drupalSettings'],
    },
  });
  await fs.writeFile(file, isDev ? replaced : code, 'utf8');
}

/**
 * Builds vanilla JS files.
 *
 * @param {Object} config - Configuration object.
 * @param {Object} config.jsFiles - An object where keys are file names and values are file paths.
 * @param {string} config.outDir - Output directory.
 * @param {boolean} [config.isDev=false] - Whether to build in development mode.
 * @return {Promise<void>} - Resolves when all files are built.
 */
export async function buildVanillaJs(config = {}) {
  const { jsFiles, outDir, isDev = false } = config;

  await Promise.all(
    Object.entries(jsFiles).map(async ([name, entry]) => {
      const outfile = `${outDir}/js/${name}.min.js`;

      try {
        await esbuild.build({
          bundle: true,
          charset: 'utf8',
          define: {
            'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
          },
          external: ['@playwright/test'],
          entryPoints: [entry],
          format: 'iife',
          // outfile,
          outfile: `${outDir}/js/${name}.min.js`,
          sourcemap: isDev,
          target: 'es2020',
          keepNames: true,
          legalComments: 'none',
          logLevel: 'silent',
        });

        await stripUseStrict(outfile);
        await revertDrupalGlobal(outfile, isDev);
      } catch (err) {
        console.error(`❌ Error bundling ${name}:`, err.message);
      }
    })
  );
}

/**
 * Builds React apps.
 *
 * @param {Object} config - Configuration object.
 * @param {Object} config.reactApps - An object where keys are app names and values are entry points.
 * @param {string} config.outDir - Output directory.
 * @param {boolean} [config.isDev=false] - Whether to build in development mode.
 * @return {Promise<void>} - Resolves when all apps are built.
 */
export async function buildReactApps(config = {}) {
  const { reactApps, outDir, isDev = false } = config;
  const projectRoot = process.cwd();
  const require = createRequire(import.meta.url);

  await Promise.all(
    Object.entries(reactApps).map(async ([name, entry]) => {
      const outfile = `${outDir}/js/${name}.min.js`;

      try {
        await esbuild.build({
          plugins: [
            {
              name: 'dedupe-react',
              setup(build) {
                // Match imports for 'react' or 'react-dom' and convert
                // the import name to its actual file path.
                // This is needed to prevent esbuild from using the 'react'
                // or 'react-dom' dependency from two different packages.
                build.onResolve({ filter: /^react(-dom)?$/ }, args => ({
                  path: require.resolve(args.path),
                }));
              }
            }
          ],
          bundle: true,
          charset: 'utf8',
          define: {
            'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
            ...(isDev ? { 'ELASTIC_DEV_URL': JSON.stringify(process.env.ELASTIC_DEV_URL || '') } : {}),
          },
          entryPoints: [entry],
          external: ['Drupal', 'drupalSettings'],
          format: 'iife',
          keepNames: true,
          minify: !isDev,
          legalComments: 'none',
          logLevel: 'silent',
          tsconfig: path.resolve(projectRoot, 'tsconfig.json'),
          outfile,
          sourcemap: isDev,
          target: 'es2020',
        });
        await stripUseStrict(outfile);
      } catch (err) {
        console.error(`❌ Error bundling React app ${name}:`, err.message);
      }
    })
  );
}

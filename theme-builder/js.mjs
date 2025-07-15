import esbuild from 'esbuild';
import fs from 'fs/promises';

async function stripUseStrict(file) {
  const content = await fs.readFile(file, 'utf8');
  const stripped = content.replace(/["']use strict["'];?/g, '');
  await fs.writeFile(file, stripped, 'utf8');
}

const drupalGlobals = {
  name: 'drupal-globals',
  setup(build) {
    // Handle bare import "Drupal"
    build.onResolve({ filter: /^Drupal$/ }, () => ({
      path: 'Drupal',
      namespace: 'Drupal',
    }));

    // Handle bare import "drupalSettings"
    build.onResolve({ filter: /^drupalSettings$/ }, () => ({
      path: 'drupalSettings',
      namespace: 'drupalSettings',
    }));

    // Provide virtual module code for both
    build.onLoad({ filter: /.*/, namespace: 'drupal' }, (args) => {
      const globalName = args.path;            // "Drupal" or "drupalSettings"
      return {
        contents: `export default globalThis.${globalName};`,
        loader: 'js',
      };
    });
  },
};

async function themeBuilderJs(opts = {}) {
  const { entries, isDev, outDir } = opts;

  await Promise.all(
    Object.entries(entries).map(async ([name, entry]) => {
      const outfile = `${outDir}/js/${name}.min.js`;

      try {
        await esbuild.build({
          bundle: true,
          charset: 'utf8',
          define: {
            'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
          },
          entryPoints: [entry],
          external: ['Drupal', 'drupalSettings'],
          format: 'iife',
          logLevel: 'silent',
          legalComments: 'none',
          minify: !isDev,
          outfile,
          sourcemap: isDev,
          target: 'es2020',
          plugins: [drupalGlobals],
        });

        await stripUseStrict(outfile);
      } catch (e) {
        console.error(`❌ Error building ${name}:`, e.message);
      }
    })
  );
}

export default themeBuilderJs;

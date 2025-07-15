import esbuild from 'esbuild';
import fs from 'fs/promises';

async function stripUseStrict(file) {
  const content = await fs.readFile(file, 'utf8');
  const stripped = content.replace(/["']use strict["'];?/g, '');
  await fs.writeFile(file, stripped, 'utf8');
}

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
          keepNames: true,
        });

        await stripUseStrict(outfile);
      } catch (e) {
        console.error(`❌ Error building ${name}:`, e.message);
      }
    })
  );
}

export default themeBuilderJs;

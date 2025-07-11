import esbuild from 'esbuild';

export async function themeBuilderJs(opts = {}) {
  const { entries, isDev, outDir } = opts;

  Object.entries(entries).map(([name, entry]) =>
    esbuild
      .build({
        entryPoints: [entry],
        bundle: true,
        minify: !isDev,
        sourcemap: isDev,
        target: 'es2020',
        format: 'iife',
        outfile: `${outDir}/js/${name}.min.js`,
        define: {
          'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        },
        charset: 'utf8',
        external: ['Drupal', 'drupalSettings'],
        logLevel: 'silent',
        legalComments: 'none',
      })
      .catch((e) => console.error(`❌ Error building ${name}:`, e.message))
  );
}

export async function themeBuilderJsSingle(opts = {}) {
  const { entryName, entry, isDev, outDir } = opts;
  esbuild
    .build({
      entryPoints: [entry],
      bundle: true,
      minify: !isDev,
      target: 'es2020',
      format: 'iife',
      outfile: `${outDir}/js/${entryName}.min.js`,
      define: {
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      },
      charset: 'utf8',
      external: ['Drupal', 'drupalSettings'],
      logLevel: 'silent',
      legalComments: 'none',
    })
    .catch((e) => console.error(`❌ Error building ${entryName}:`, e.message));
}

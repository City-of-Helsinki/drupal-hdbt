import path from 'path';
import fs from 'fs';
import * as sass from 'sass';
import { execSync } from 'child_process';

export default async function themeBuilderCss(opts = {}) {
  const { isDev, styles, outDir } = opts;

  console.warn('🎨 Building CSS…');
  const debugVar = `$debug_mode: ${isDev};\n`;

  styles.forEach(([input, output]) => {
    const outFile = path.join(outDir, output);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    if (!fs.existsSync(input)) {
      console.warn(`⚠️ Skipping missing file: ${input}`);
      return;
    }

    try {
      const mainContent = fs.readFileSync(input, 'utf8');
      const contentWithDebug = debugVar + mainContent;

      const result = sass.compileString(contentWithDebug, {
        style: 'compressed',
        loadPaths: ['src/scss', 'node_modules'],
        quietDeps: true,
        silenceDeprecations: ['import'],
        sourceMap: isDev,
        charset: true,
      });

      fs.writeFileSync(outFile, result.css, 'utf8');
      execSync(`npx postcss ${outFile} --replace`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`❌ Error building ${input}:`, e.message);
    }
  });
};

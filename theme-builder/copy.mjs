import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

export default async function themeBuilderCopy(opts = {}) {

  const { staticFiles } = opts;
  // Check if a pattern is a glob.
  const isGlob = (pattern) => /[*?[{\]]/.test(pattern);
  // Remove sourceMappingURL comments from JS files.
  const stripSourceMapComment = (content) => content.replace(/^[ \t]*\/\/[#@]\s*sourceMappingURL=.*$/gm, '');

  // Copy a file, removing sourceMappingURL comments from JS files.
  const copyFile = (from, to) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });

    if (path.extname(from) === '.js' || path.extname(from) === '.mjs') {
      const content = fs.readFileSync(from, 'utf8');
      const cleaned = stripSourceMapComment(content);
      fs.writeFileSync(to, cleaned, 'utf8');
      return;
    }
    fs.copyFileSync(from, to);
  };

  // Copy static files.
  await new Promise((resolve) => {
    staticFiles.forEach(([from, to]) => {
      if (isGlob(from)) {
        const files = globSync(from);
        files.forEach((file) => {
          const filename = path.basename(file);
          const destPath = path.join(to, filename);
          copyFile(file, destPath);
        });
        return;
      }
      copyFile(from, to);
    });
    resolve();
  });
}

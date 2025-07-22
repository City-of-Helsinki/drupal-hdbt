import { globSync } from 'glob';
import path from 'path';
import fs from 'fs';

export default async function themeBuilderCopy(opts = {}) {

  const { staticFiles } = opts;
  const isGlob = (pattern) => /[*?[{\]]/.test(pattern);

  await new Promise((resolve) => {
    staticFiles.forEach(([from, to]) => {
      if (isGlob(from)) {
        const files = globSync(from);
        files.forEach((file) => {
          const filename = path.basename(file);
          const destPath = path.join(to, filename);
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(file, destPath);
        });
      } else {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
    });
    resolve();
  });
};

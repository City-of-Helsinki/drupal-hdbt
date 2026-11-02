import { cpSync, mkdirSync, mkdtempSync, readdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const brokenDir = path.resolve(import.meta.dirname, 'fixtures/broken');

/**
 * Copy the fixture theme to a temporary directory and enter it.
 *
 * @return {string} The temporary theme directory.
 */
export function enterFixtureTheme() {
  const root = path.resolve(import.meta.dirname, '..');
  const dir = mkdtempSync(path.join(tmpdir(), 'theme-builder-'));
  cpSync(path.resolve(import.meta.dirname, 'fixtures/theme'), dir, { recursive: true });

  // Install the builder and its dependencies the way npm does in a theme.
  const nodeModules = path.join(dir, 'node_modules');
  mkdirSync(nodeModules, { recursive: true });
  for (const name of readdirSync(path.join(root, 'node_modules'))) {
    symlinkSync(path.join(root, 'node_modules', name), path.join(nodeModules, name));
  }
  mkdirSync(path.join(nodeModules, '@hdbt'));
  symlinkSync(root, path.join(nodeModules, '@hdbt/theme-builder'));

  process.chdir(dir);
  return dir;
}

#!/usr/bin/env node
/**
 * Checks that package-lock.json matches the theme builder dependencies.
 *
 * The theme builder is installed from a directory, and `npm ci` does not
 * compare the directory's package.json with the lockfile. When an hdbt update
 * changes the builder dependencies, `npm ci` would install the new builder
 * without them. Run this before the install to fail early instead.
 *
 * Usage, from the theme or module directory:
 *   node <path to theme-builder>/tools/check-lock.mjs <path to theme-builder>
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DEPENDENCY_FIELDS = ['dependencies', 'optionalDependencies', 'peerDependencies'];

const builderDir = process.argv[2];
if (!builderDir) {
  console.error('Usage: check-lock.mjs <path to theme-builder>');
  process.exit(2);
}

// Without a lockfile or a locked builder, npm resolves the builder anyway.
const lockFile = path.resolve('package-lock.json');
if (!existsSync(lockFile)) {
  process.exit(0);
}
const locked = JSON.parse(readFileSync(lockFile, 'utf8')).packages?.['node_modules/@hdbt/theme-builder'];
if (!locked) {
  process.exit(0);
}

const builder = JSON.parse(readFileSync(path.resolve(builderDir, 'package.json'), 'utf8'));

const changes = DEPENDENCY_FIELDS.flatMap((field) => {
  const wanted = builder[field] ?? {};
  const recorded = locked[field] ?? {};
  return [...new Set([...Object.keys(wanted), ...Object.keys(recorded)])]
    .filter((name) => wanted[name] !== recorded[name])
    .sort()
    .map((name) => `  ${name}: ${recorded[name] ?? '(none)'} -> ${wanted[name] ?? '(removed)'}`);
});

if (changes.length) {
  console.error(
    [
      'package-lock.json does not match the @hdbt/theme-builder dependencies:',
      ...changes,
      'Run `npm run update-theme-builder` and commit package-lock.json.',
    ].join('\n'),
  );
  process.exit(1);
}

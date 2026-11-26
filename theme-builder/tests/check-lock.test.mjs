import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

const script = path.resolve(import.meta.dirname, '../tools/check-lock.mjs');

/**
 * Create a theme with a lockfile and a builder with the given dependencies.
 *
 * @param {object|null} lockedBuilder The locked builder entry, or null for none.
 * @param {object} builderDependencies The builder package.json dependencies.
 * @param {boolean} withLock Whether the theme has a package-lock.json.
 * @return {object} The spawnSync result of the check.
 */
function check(lockedBuilder, builderDependencies, withLock = true) {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-lock-'));
  const builderDir = path.join(dir, 'builder');
  const themeDir = path.join(dir, 'theme');
  mkdirSync(builderDir);
  mkdirSync(themeDir);
  writeFileSync(path.join(builderDir, 'package.json'), JSON.stringify({ dependencies: builderDependencies }));
  if (withLock) {
    const packages = { '': {} };
    if (lockedBuilder) {
      packages['node_modules/@hdbt/theme-builder'] = lockedBuilder;
    }
    writeFileSync(path.join(themeDir, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages }));
  }
  return spawnSync(process.execPath, [script, '../builder'], { cwd: themeDir, encoding: 'utf8' });
}

describe('check-lock', () => {
  it('passes when the lockfile matches the builder', () => {
    const { status, stderr } = check({ dependencies: { sass: '^1.0.0' } }, { sass: '^1.0.0' });
    assert.equal(status, 0, stderr);
  });

  it('fails and lists the changes when the builder dependencies changed', () => {
    const { status, stderr } = check(
      { dependencies: { sass: '^1.0.0', terser: '^5.0.0' } },
      { sass: '^1.2.0', esbuild: '0.28.0' },
    );
    assert.equal(status, 1);
    assert.match(stderr, /esbuild: \(none\) -> 0\.28\.0/);
    assert.match(stderr, /sass: \^1\.0\.0 -> \^1\.2\.0/);
    assert.match(stderr, /terser: \^5\.0\.0 -> \(removed\)/);
    assert.match(stderr, /npm run update-theme-builder/);
  });

  it('passes without a lockfile or a locked builder', () => {
    assert.equal(check(null, { sass: '^1.0.0' }, false).status, 0);
    assert.equal(check(null, { sass: '^1.0.0' }).status, 0);
  });
});

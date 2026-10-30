import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';
import { buildAll } from '../builder.mjs';
import { enterFixtureTheme } from './fixture.mjs';

/**
 * Wait until the condition is true.
 *
 * @param {Function} condition
 *   Returns true when the wait is over.
 * @param {string} message
 *   The assertion message on timeout.
 */
async function waitFor(condition, message) {
  const end = Date.now() + 15000;
  while (!condition()) {
    assert.ok(Date.now() < end, message);
    await setTimeout(50);
  }
}

describe('Theme build script', () => {
  let dir;

  beforeEach(() => {
    dir = enterFixtureTheme();
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  /**
   * Run the theme build script.
   *
   * @return {object}
   *   The spawnSync result.
   */
  const build = () => spawnSync(process.execPath, ['theme-builder.mjs'], { cwd: dir, encoding: 'utf8' });

  it('builds every asset', () => {
    const { status, stderr } = build();
    assert.equal(status, 0, stderr);

    const dist = path.join(dir, 'dist');
    const files = [
      'icons.json',
      'css/icons.css',
      'css/ckeditor-icons.css',
      'css/styles.min.css',
      'js/fixture.min.js',
      'js/fixture-app.min.js',
      'js/static/static.js',
      'fonts/fixture.woff2',
    ];
    for (const file of files) {
      assert.ok(existsSync(path.join(dist, file)), `${file} is built.`);
    }
    assert.ok(readdirSync(path.join(dist, 'icons')).some((file) => /^sprite-[0-9a-f]{5}\.svg$/.test(file)), 'The hashed sprite is built.');
    assert.doesNotMatch(readFileSync(path.join(dist, 'js/static/static.js'), 'utf8'), /sourceMappingURL/, 'Source map comments are stripped from static files.');
  });

  it('exits with an error when SCSS fails to compile', () => {
    writeFileSync(path.join(dir, 'src/scss/styles.scss'), '.broken { display: $undefined-variable; }');

    const { status, stderr } = build();
    assert.equal(status, 1, 'The build exits with code 1.');
    assert.match(stderr, /Error building src\/scss\/styles\.scss/, 'The failing SCSS file is named.');
  });

  it('exits with an error when a JS file fails to bundle', () => {
    writeFileSync(path.join(dir, 'src/js/fixture.js'), 'const broken = ;');

    const { status, stderr } = build();
    assert.equal(status, 1, 'The build exits with code 1.');
    assert.match(stderr, /Error bundling fixture/, 'The failing JS file is named.');
  });
});

describe('Partial build config', () => {
  let dir;

  before(() => {
    dir = enterFixtureTheme();
  });

  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('builds CSS when no other assets are configured', async () => {
    const outDir = path.join(dir, 'dist');
    await buildAll({ outDir, cssConfig: { styles: [['src/scss/styles.scss', 'css/styles.min.css']], isDev: false, outDir } });

    assert.ok(existsSync(path.join(outDir, 'css/styles.min.css')), 'The CSS file is built.');
  });
});

describe('Watch mode', () => {
  let dir;
  let watcher;
  let output = '';

  before(() => {
    dir = enterFixtureTheme();
    watcher = spawn(process.execPath, ['theme-builder.mjs', '--watch'], { cwd: dir });
    watcher.stderr.on('data', (chunk) => {
      output += chunk;
    });
  });

  after(() => {
    watcher.kill();
    rmSync(dir, { recursive: true, force: true });
  });

  it('keeps watching after a failed rebuild and rebuilds the fixed file', async () => {
    const scss = path.join(dir, 'src/scss/styles.scss');
    const css = path.join(dir, 'dist/css/styles.min.css');

    await waitFor(() => output.includes('Watching for changes'), 'The initial build finishes.');

    writeFileSync(scss, '.broken { display: $undefined-variable; }');
    await waitFor(() => output.includes('Error building src/scss/styles.scss'), 'The failed rebuild is reported.');
    assert.equal(watcher.exitCode, null, 'The watcher is still running.');

    // Wait out the change event throttle.
    await setTimeout(200);
    writeFileSync(scss, '.fixture__watch { display: grid; }');
    await waitFor(() => readFileSync(css, 'utf8').includes('.fixture__watch{display:grid}'), 'The fixed file is rebuilt.');
  });
});

import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { buildVanillaJs } from '../js.mjs';
import { brokenDir, enterFixtureTheme } from './fixture.mjs';

describe('Vanilla JS build', () => {
  let dir;

  before(() => {
    dir = enterFixtureTheme();
  });

  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('keeps the Drupal global name in the bundle', async () => {
    const outDir = path.join(dir, 'dist');
    await buildVanillaJs({ jsFiles: { fixture: 'src/js/fixture.js' }, isDev: false, outDir });

    const js = readFileSync(path.join(outDir, 'js/fixture.min.js'), 'utf8');
    assert.ok(js.includes('Drupal.t('), 'Drupal.t is called by its original name.');
    assert.doesNotMatch(js, /\bDrupal\d+\b/, 'No renamed Drupal identifiers remain.');
    assert.doesNotMatch(js, /use strict/, 'The use strict directive is removed.');
  });

  it('bundles a package from a configured node path', async () => {
    const outDir = path.join(dir, 'dist');
    mkdirSync(path.join(dir, 'shared/node_modules/fixture-lib'), { recursive: true });
    writeFileSync(path.join(dir, 'shared/node_modules/fixture-lib/index.js'), "export const greeting = 'Hello from fixture-lib';");
    writeFileSync(path.join(dir, 'src/js/greeting.js'), "import { greeting } from 'fixture-lib';\nconsole.log(greeting);");

    await buildVanillaJs({ jsFiles: { greeting: 'src/js/greeting.js' }, isDev: false, outDir, nodePaths: ['shared/node_modules'] });

    const js = readFileSync(path.join(outDir, 'js/greeting.min.js'), 'utf8');
    assert.ok(js.includes('Hello from fixture-lib'), 'The package from the configured node path is bundled.');
  });

  it('rejects when a file fails to bundle', async () => {
    const jsFiles = { broken: path.join(brokenDir, 'broken.js') };

    await assert.rejects(buildVanillaJs({ jsFiles, isDev: false, outDir: path.join(dir, 'dist') }));
  });
});

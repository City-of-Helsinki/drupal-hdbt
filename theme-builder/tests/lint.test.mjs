import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { describe, it } from 'node:test';
import stylelint from 'stylelint';

const root = path.resolve(import.meta.dirname, '..');

describe('Stylelint config', () => {
  it('loads every plugin and applies the HELFI rules', async () => {
    const { results } = await stylelint.lint({
      code: '.fixture { color: red; }',
      codeFilename: 'fixture.scss',
      configFile: path.join(root, '.stylelintrc.yaml'),
    });

    assert.deepEqual(results[0].invalidOptionWarnings, [], 'The config has no invalid options.');
    assert.ok(results[0].warnings.some(({ rule }) => rule === 'color-named'), 'Named colors are reported.');
  });
});

describe('Biome config', () => {
  it('lints the fixture theme without errors', () => {
    const { status, stderr } = spawnSync(
      path.join(root, 'node_modules/.bin/biome'),
      ['lint', 'tests/fixtures/theme/src/js'],
      { cwd: root, encoding: 'utf8' },
    );

    assert.equal(status, 0, stderr);
  });
});

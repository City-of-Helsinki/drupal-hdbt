import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { themeBuilderCss } from '../css.mjs';
import { brokenDir, enterFixtureTheme } from './fixture.mjs';

describe('CSS build', () => {
  let dir;

  before(() => {
    dir = enterFixtureTheme();
  });

  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('compiles SCSS that imports a builder dependency', async () => {
    const outDir = path.join(dir, 'dist');
    await themeBuilderCss({ styles: [['src/scss/styles.scss', 'css/styles.min.css']], isDev: false, outDir });

    const css = readFileSync(path.join(outDir, 'css/styles.min.css'), 'utf8');
    assert.match(css, /@media[^{]*768px/, 'The breakpoint mixin produces a media query.');
    assert.ok(css.includes('.fixture__item{display:block}'), 'Nested selectors are flattened and minified.');
  });

  it('compiles SCSS that imports a package from a configured node path', async () => {
    const outDir = path.join(dir, 'dist');
    mkdirSync(path.join(dir, 'shared/node_modules/fixture-tokens'), { recursive: true });
    writeFileSync(path.join(dir, 'shared/node_modules/fixture-tokens/_tokens.scss'), '$fixture-color: #123456;');
    writeFileSync(path.join(dir, 'src/scss/tokens.scss'), "@import 'fixture-tokens/tokens';\n.fixture { color: $fixture-color; }");

    const styles = [['src/scss/tokens.scss', 'css/tokens.min.css']];
    await themeBuilderCss({ styles, isDev: false, outDir, nodePaths: ['shared/node_modules'] });

    const css = readFileSync(path.join(outDir, 'css/tokens.min.css'), 'utf8');
    assert.ok(css.includes('#123456'), 'The variable from the configured node path is used.');
  });

  it('rejects when SCSS fails to compile', async () => {
    const styles = [[path.join(brokenDir, 'broken.scss'), 'css/broken.min.css']];

    await assert.rejects(themeBuilderCss({ styles, isDev: false, outDir: path.join(dir, 'dist') }));
  });
});

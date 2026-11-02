import assert from 'node:assert/strict';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import themeBuilderIcons from '../icons.mjs';
import { enterFixtureTheme } from './fixture.mjs';

describe('Icon sprite build', () => {
  let dir;
  let outDir;

  before(async () => {
    dir = enterFixtureTheme();
    outDir = path.join(dir, 'dist');
    await themeBuilderIcons({
      inputPattern: 'icons/*.svg',
      outDir,
      spriteOut: 'icons/sprite.svg',
      cssOut: 'css/icons.css',
      ckeditorCssOut: 'css/ckeditor-icons.css',
      jsonOut: 'icons.json',
      iconClass: 'hel',
    });
  });

  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('writes a hashed sprite that contains every icon', () => {
    const [sprite] = readdirSync(path.join(outDir, 'icons'));
    assert.match(sprite, /^sprite-[0-9a-f]{5}\.svg$/, 'The sprite filename contains a content hash.');

    const svg = readFileSync(path.join(outDir, 'icons', sprite), 'utf8');
    assert.ok(svg.includes('id="alert"'), 'The sprite contains the alert icon.');
    assert.ok(svg.includes('id="arrow"'), 'The sprite contains the arrow icon.');
  });

  it('lists every icon name in the JSON file', () => {
    const names = JSON.parse(readFileSync(path.join(outDir, 'icons.json'), 'utf8'));
    assert.deepEqual(names.sort(), ['alert', 'arrow']);
  });

  it('writes a CSS custom property for every icon', () => {
    const css = readFileSync(path.join(outDir, 'css/icons.css'), 'utf8');
    assert.ok(css.includes('--hel-icon--alert:url('), 'The alert icon has a custom property.');
    assert.ok(css.includes('--hel-icon--arrow:url('), 'The arrow icon has a custom property.');
  });

  it('points the icon URLs to the hdbt dist folder by default', () => {
    const css = readFileSync(path.join(outDir, 'css/icons.css'), 'utf8');
    assert.match(css, /url\(\.\.\/\.\.\/\.\.\/\.\.\/contrib\/hdbt\/dist\/icons\/sprite-[0-9a-f]{5}\.svg#alert\)/, 'The URL points to the hdbt sprite.');
  });

  it('points the icon URLs to the configured sprite base URL', async () => {
    const moduleOutDir = path.join(dir, 'module-dist');
    await themeBuilderIcons({
      inputPattern: 'icons/*.svg',
      outDir: moduleOutDir,
      spriteOut: 'icons/sprite.svg',
      cssOut: 'css/icons.css',
      ckeditorCssOut: 'css/ckeditor-icons.css',
      jsonOut: 'icons.json',
      iconClass: 'hel',
      spriteBaseUrl: '/modules/custom/fixture/dist',
    });

    const css = readFileSync(path.join(moduleOutDir, 'css/icons.css'), 'utf8');
    assert.match(css, /url\(\/modules\/custom\/fixture\/dist\/icons\/sprite-[0-9a-f]{5}\.svg#alert\)/, 'The URL points to the configured sprite base URL.');
  });
});

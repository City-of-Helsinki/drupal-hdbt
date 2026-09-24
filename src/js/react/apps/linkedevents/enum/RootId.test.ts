import { beforeEach, describe, expect, it } from 'vitest';
import { EVENTS_ROOT_SELECTOR } from './RootId';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('EVENTS_ROOT_SELECTOR', () => {
  it('matches embeds marked with the class', () => {
    document.body.innerHTML = '<div class="helfi-events-search"></div><div class="helfi-events-search"></div>';

    expect(document.querySelectorAll(EVENTS_ROOT_SELECTOR)).toHaveLength(2);
  });

  it('matches every embed of a subtheme that still emits the same id', () => {
    document.body.innerHTML = '<div id="helfi-events-search"></div><div id="helfi-events-search"></div>';

    expect(document.querySelectorAll(EVENTS_ROOT_SELECTOR)).toHaveLength(2);
  });

  it('counts an embed carrying both only once', () => {
    document.body.innerHTML = '<div class="helfi-events-search" id="helfi-events-search"></div>';

    expect(document.querySelectorAll(EVENTS_ROOT_SELECTOR)).toHaveLength(1);
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Tags from './Tags';

describe('Tags', () => {
  test('renders one list item per tag', () => {
    const { container } = render(<Tags tags={[{ tag: 'News' }, { tag: 'Culture' }]} />);
    const items = container.querySelectorAll('.content-tags__tags__tag');
    expect(items).toHaveLength(2);
    expect(container.textContent).toContain('News');
    expect(container.textContent).toContain('Culture');
  });

  test('renders as a section with the static modifier by default', () => {
    const { container } = render(<Tags tags={[{ tag: 'News' }]} />);
    expect(container.querySelector('section')).not.toBeNull();
    expect(container.querySelector('.content-tags__tags--static')).not.toBeNull();
  });

  test('renders as an interactive group div when inside a card', () => {
    const { container } = render(<Tags tags={[{ tag: 'News' }]} isInteractive insideCard />);
    expect(container.querySelector('section')).toBeNull();
    expect(container.querySelector('div[role="group"]')).not.toBeNull();
    expect(container.querySelector('.content-tags__tags--interactive')).not.toBeNull();
  });

  test('applies the color modifier class to a tag', () => {
    const { container } = render(<Tags tags={[{ tag: 'News', color: 'engel' }]} />);
    expect(container.querySelector('.content-tags__tags__tag--engel')).not.toBeNull();
  });
});

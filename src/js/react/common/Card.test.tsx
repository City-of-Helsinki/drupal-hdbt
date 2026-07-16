import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import CardItem from './Card';

describe('CardItem', () => {
  test('renders the title in an h4 by default', () => {
    const { container } = render(<CardItem cardTitle='Hello world' />);
    const heading = container.querySelector('.card__title');
    expect(heading?.tagName).toBe('H4');
    expect(heading?.textContent).toBe('Hello world');
  });

  test('renders the title at the requested heading level', () => {
    const { container } = render(<CardItem cardTitle='Hello world' cardTitleLevel={2} />);
    expect(container.querySelector('.card__title')?.tagName).toBe('H2');
  });

  test('renders a plain internal link when a URL is given', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardUrl='/events/foo' />);
    const link = container.querySelector('a.card__link');
    expect(link?.getAttribute('href')).toBe('/events/foo');
    // Internal links are not marked as external.
    expect(link?.getAttribute('data-is-external')).toBeNull();
  });

  test('renders an ExternalLink when the URL is external', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardUrl='https://example.com' cardUrlExternal />);
    const link = container.querySelector('a.card__link');
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.getAttribute('data-is-external')).toBe('true');
  });

  test('renders the title without a link when no URL is given', () => {
    const { container } = render(<CardItem cardTitle='Hello' />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('.card__title')?.textContent).toBe('Hello');
  });

  test('renders a plain-text description', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardDescription='Just text' />);
    const description = container.querySelector('.card__description');
    expect(description?.textContent).toBe('Just text');
    // Plain descriptions are wrapped in a paragraph, not parsed as HTML.
    expect(description?.querySelector('p')).not.toBeNull();
  });

  test('parses an HTML description when cardDescriptionHtml is set', () => {
    const { container } = render(
      <CardItem cardTitle='Hello' cardDescription='<strong>Bold</strong>' cardDescriptionHtml />,
    );
    const description = container.querySelector('.card__description');
    expect(description?.querySelector('strong')?.textContent).toBe('Bold');
  });

  test('applies the modifier class to the card root', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardModifierClass='card--news' />);
    expect(container.querySelector('.card')?.className).toContain('card--news');
  });

  test('adds the external modifier class for external cards', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardUrl='https://example.com' cardUrlExternal />);
    expect(container.querySelector('.card')?.className).toContain('card--external');
  });

  test('renders a location meta row with its label and content', () => {
    const { container } = render(<CardItem cardTitle='Hello' location='Helsinki' />);
    const meta = container.querySelector('.card__meta');
    expect(meta?.querySelector('.card__meta__label')?.textContent).toBe('Location: ');
    expect(meta?.querySelector('.card__meta__content')?.textContent).toBe('Helsinki');
  });

  test('omits the meta section entirely when there is no meta data', () => {
    const { container } = render(<CardItem cardTitle='Hello' />);
    expect(container.querySelector('.card__metas')).toBeNull();
  });

  test('renders the card image wrapper when an image is provided', () => {
    const { container } = render(<CardItem cardTitle='Hello' cardImage={<img alt='' src='/img.jpg' />} />);
    const image = container.querySelector('.card__image');
    expect(image).not.toBeNull();
    expect(image?.querySelector('img')?.getAttribute('src')).toBe('/img.jpg');
  });

  test('renders category and content tags', () => {
    const { container } = render(
      <CardItem
        cardTitle='Hello'
        cardCategoryTag={{ tag: 'News', color: 'engel' }}
        cardTags={[{ tag: 'Culture' }, { tag: 'Sports' }]}
      />,
    );
    expect(container.querySelector('.card__category')?.textContent).toContain('News');
    const tagsSection = container.querySelector('.card__tags');
    expect(tagsSection?.textContent).toContain('Culture');
    expect(tagsSection?.textContent).toContain('Sports');
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import CardPicture from './CardPicture';

const imageUrls = { '1248': '/1248.jpg', '768': '/768.jpg' };

describe('CardPicture', () => {
  test('renders nothing when no source is available', () => {
    const { container } = render(<CardPicture />);
    expect(container.firstChild).toBeNull();
  });

  test('falls back to the 1248 image url as the img src', () => {
    const { container } = render(<CardPicture imageUrls={imageUrls} />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/1248.jpg');
  });

  test('prefers the explicit src prop over the image urls', () => {
    const { container } = render(<CardPicture src='/explicit.jpg' imageUrls={imageUrls} />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/explicit.jpg');
  });

  test('renders a responsive source for each breakpoint', () => {
    const { container } = render(<CardPicture imageUrls={imageUrls} />);
    expect(container.querySelectorAll('picture source')).toHaveLength(5);
  });

  test('uses imageOverride variants when provided', () => {
    const { container } = render(
      <CardPicture imageOverride={{ photographer: 'Ansel', variants: { '1248': '/override.jpg' } }} />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/override.jpg');
    expect(img?.getAttribute('data-photographer')).toBe('Ansel');
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import CardImage from './CardImage';

describe('CardImage', () => {
  test('renders an image with the given src and empty alt', () => {
    const { container } = render(<CardImage src='/photo.jpg' />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/photo.jpg');
    expect(img?.getAttribute('alt')).toBe('');
  });

  test('exposes the photographer as a data attribute', () => {
    const { container } = render(<CardImage src='/photo.jpg' photographer='Jane Doe' />);
    expect(container.querySelector('img')?.getAttribute('data-photographer')).toBe('Jane Doe');
  });

  test('forwards arbitrary img attributes', () => {
    const { container } = render(<CardImage src='/photo.jpg' width={200} className='card__img' />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('200');
    expect(img?.className).toBe('card__img');
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Teaser } from './Teaser';

describe('Teaser', () => {
  test('renders the title as an external link to the given url', () => {
    const { container } = render(<Teaser image={<img alt='' src='/x.jpg' />} title='Event' url='/event/1' />);
    const link = container.querySelector('a.card-teaser__link');
    expect(link?.getAttribute('href')).toBe('/event/1');
    expect(link?.textContent).toContain('Event');
  });

  test('renders the image', () => {
    const { container } = render(<Teaser image={<img alt='' src='/x.jpg' />} title='Event' url='/event/1' />);
    expect(container.querySelector('.card-teaser__img img')?.getAttribute('src')).toBe('/x.jpg');
  });

  test('renders the time only when provided', () => {
    const { container, rerender } = render(<Teaser image={null} title='Event' url='/event/1' />);
    expect(container.querySelector('.card-teaser__datetime')).toBeNull();
    rerender(<Teaser image={null} title='Event' url='/event/1' time='12.5.2026' />);
    expect(container.querySelector('.card-teaser__datetime')?.textContent).toBe('12.5.2026');
  });

  test('appends the class name to the list item', () => {
    const { container } = render(<Teaser image={null} title='Event' url='/event/1' className='highlight' />);
    expect(container.querySelector('li')?.className).toContain('highlight');
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { CardGhost } from './CardGhost';

describe('CardGhost', () => {
  test('renders a ghost card with an image placeholder by default', () => {
    const { container } = render(<CardGhost />);
    const card = container.querySelector('.card--ghost');
    expect(card).not.toBeNull();
    expect(card?.querySelector('.card__image')).not.toBeNull();
  });

  test('omits the image and adds the simple modifier when simple', () => {
    const { container } = render(<CardGhost simple />);
    expect(container.querySelector('.card--ghost--simple')).not.toBeNull();
    expect(container.querySelector('.card__image')).toBeNull();
  });

  test('adds the border modifier when bordered', () => {
    const { container } = render(<CardGhost bordered />);
    expect(container.querySelector('.card--border')).not.toBeNull();
  });
});

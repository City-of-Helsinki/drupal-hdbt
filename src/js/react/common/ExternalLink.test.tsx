import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  test('renders an external anchor with the title and screen-reader hint', () => {
    const { container, getByText } = render(<ExternalLink href='https://example.com' title='Example' />);
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.getAttribute('data-is-external')).toBe('true');
    expect(link?.textContent).toContain('Example');
    expect(getByText('Link leads to external service').className).toContain('visually-hidden');
  });

  test('renders the external type indicator by default', () => {
    const { container } = render(<ExternalLink href='https://example.com' title='Example' />);
    expect(container.querySelector('.link__type--external')).not.toBeNull();
  });

  test('omits the type indicator and sets HDS data attributes when rendered as a button', () => {
    const { container } = render(
      <ExternalLink
        href='https://example.com'
        title='Example'
        data-hds-component='button'
        data-hds-variant='primary'
      />,
    );
    const link = container.querySelector('a');
    expect(container.querySelector('.link__type--external')).toBeNull();
    expect(link?.getAttribute('data-hds-component')).toBe('button');
    expect(link?.getAttribute('data-hds-variant')).toBe('primary');
  });
});

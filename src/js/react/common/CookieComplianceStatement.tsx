import { Link } from 'hds-react';
import ExternalLink from './ExternalLink';

declare global {
  interface Window {
    hdsCookieConsentClickEvent: (event: Event, element: HTMLElement) => void;
  }
}

type CookiCookieComplianceStatementProps = {
  host: string;
  policyUrl?: string;
  sourceUrl?: string;
};

const CookieComplianceStatement = ({ host, policyUrl, sourceUrl }: CookiCookieComplianceStatementProps) => (
  <div className='embedded-content-cookie-compliance'>
    <div className='message'>
      <h2>{Drupal.t('Content cannot be displayed', {}, { context: 'Cookie compliance' })}</h2>
      <p>
        {Drupal.t(
          'This content is hosted by @media_service_url. To see the content, switch over to the external site or modify your cookie settings to allow for preference and statistics cookies.',
          { '@media_service_url': host },
          { context: 'Cookie compliance' },
        )}
      </p>
      <div className='buttons'>
        {sourceUrl && (
          <ExternalLink
            data-hds-component='button'
            data-hds-variant='primary'
            href={sourceUrl}
            title={Drupal.t('See content on external site', {}, { context: 'Cookie compliance' })}
          />
        )}
        {policyUrl && (
          <Link
            data-hds-component='button'
            data-hds-variant='secondary'
            data-cookie-consent-groups='preferences, statistics'
            href={policyUrl}
            onClick={(event) => {
              if (typeof window.hdsCookieConsentClickEvent === 'function') {
                window.hdsCookieConsentClickEvent(event.nativeEvent, event.currentTarget);
              } else {
                console.warn('hdsCookieConsentClickEvent is not defined');
              }
            }}
          >
            {Drupal.t('Change cookie settings', {}, { context: 'Cookie compliance' })}
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default CookieComplianceStatement;

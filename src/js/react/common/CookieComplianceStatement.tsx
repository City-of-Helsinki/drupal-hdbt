import ExternalLink from './ExternalLink';

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
          {'@media_service_url': host},
          { context: 'Cookie compliance' }
        )}
      </p>
      <div className='buttons'>
          {sourceUrl &&
            <ExternalLink data-hds-component='button' data-hds-variant='primary' href={sourceUrl} title={Drupal.t('See content on external site', {}, { context: 'Cookie compliance' })} />
          }
          {policyUrl &&
            <ExternalLink  data-hds-component='button' data-hds-variant='secondary' href={policyUrl} title={Drupal.t('Change cookie settings', {}, { context: 'Cookie compliance' })} />
          }
      </div>
    </div>
  </div>
);

export default CookieComplianceStatement;

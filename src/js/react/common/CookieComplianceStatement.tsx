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
            <ExternalLink className='hds-button hds-button--primary' href={sourceUrl} title={<span className='hds-button__label'>{Drupal.t('See content on external site', {}, { context: 'Cookie compliance' })}</span>} />
          }
          {policyUrl &&
            <ExternalLink className='hds-button hds-button--secondary' href={policyUrl} title={<span className='hds-button__label'>{Drupal.t('Change cookie settings', {}, { context: 'Cookie compliance' })}</span>} />
          }
      </div>
    </div>
  </div>
);

export default CookieComplianceStatement;

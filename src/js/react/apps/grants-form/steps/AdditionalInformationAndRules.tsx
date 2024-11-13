import { TextArea } from 'hds-react';
import { z } from 'zod';
import { FormField } from '../components/FormField';
import { FileInput } from '../components/FileInput';

export const AdditionalInformationAndRulesSchema = z.object({});

const fieldNames = {
  additional_information: 'additional_information',
  community_rules: 'community_rules',
};

export const AdditionalInformationAndRules = () => {
  return (
    <>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Additional information concerning the application')}
          </h3>
          <div className='webform-section-wrapper'>
            <FormField
              id={fieldNames.additional_information}
              label={Drupal.t('Additional information')}
              name={fieldNames.additional_information}
              element={TextArea}
            />
          </div>
        </div>
      </section>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Community Rules')}
          </h3>
          <div className='webform-section-wrapper'>
            All the attachments listed below must be submitted for the processing of the grant application.
            The grant application may be rejected if the attachments are not submitted.
            If any of the attachments is missing, let us know in the Further clarification on attachments section of the application.
            <FileInput
              id={fieldNames.community_rules}
              label={Drupal.t('Community Rules')}
              name={fieldNames.community_rules}
            />
          </div>
        </div>
      </section>
    </>
  )
};

import { Fieldset, Select, TextInput } from 'hds-react';
import { schemaRules } from '../enum/schemaRules';
import AutomaticApplicantinfo from './AutomaticApplicantinfo';
import { z, ZodFormattedError } from 'zod'
import { FormProps } from '../types/FormProps';
import { useAtomValue } from 'jotai';
import { getCurrentStepAtom, getItemsAtom } from '../store';
import { error } from 'console';
import { FormField } from '../components/FormField';

export const ApplicantInfoSchema = z.object({
  email: schemaRules.email,
  contact_person: z.string().min(1),
  contact_person_phone_number: schemaRules.phone,
});

const fieldNames = {
  address: 'address',
  email: 'email',
  contact_person: 'contact_person',
  contact_person_phone_number: 'contact_person_phone_number',

}

export const ApplicantInfo = () => {
  return (
    <>
      <AutomaticApplicantinfo />
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Email address')}
          </h3>
          <div className='webform-section-wrapper'>
            <div className='form-item'>
              {Drupal.t('Provide here a community email address that is actively read. Contact requests related to the grant application, such as requests for further clarification and completion, will be sent to the email address.')}
            </div>
              <FormField
                id={fieldNames.email}
                label={Drupal.t('Email address')}
                name={fieldNames.email}
                element={TextInput}
                tooltipButtonLabel={Drupal.t('Email address')}
                tooltipText={Drupal.t('Provide the email address to which you want the messages and notifications related to this application to be sent and which is actively read.')}
              />
          </div>
        </div>
      </section>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Contact person for the application')}
          </h3>
          <div className='webform-section-wrapper'>
            <FormField
              id={fieldNames.contact_person}
              label={Drupal.t('Contact person')}
              name={fieldNames.contact_person}
              element={TextInput}
            />
            <FormField
              id={fieldNames.contact_person}
              label={Drupal.t('Phone')}
              name={fieldNames.contact_person}
              element={TextInput}
            />
          </div>
        </div>
      </section>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Address')}
          </h3>
          <div className='webform-section-wrapper'>
            <Select
              id='address'
              label={Drupal.t('Address')}
              options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
                { value: '3', label: 'Option 3' },
              ]}
              placeholder={Drupal.t('-Select address-')}
              // required
              tooltipButtonLabel={Drupal.t('Select the address')}
              tooltipText={Drupal.t('If you want to add, delete or change address information, save the application as a draft and go to maintain the address information in your own data.')}
            />
          </div>
        </div>
      </section>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Account number')}
          </h3>
          <div className='webform-section-wrapper'>
            <Select
              id='address'
              label={Drupal.t('Select the account number')}
              options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
                { value: '3', label: 'Option 3' },
              ]}
              placeholder={Drupal.t('-Select account-')}
              tooltipButtonLabel={Drupal.t('Select the account number')}
              tooltipText={Drupal.t('If you want to add, delete or change account number information, save the application as a draft and go to maintain the account number information in your own data.')}
            />
          </div>
        </div>
      </section>
      <section className='form-item webform-section'>
        <div className='webform-section-flex-wrapper'>
          <h3 className='webform-section-title'>
            {Drupal.t('Persons responsible for operations')}
          </h3>
          <div className='webform-section-wrapper'>
            <Fieldset
              border
              heading={Drupal.t('Persons responsible for operations')}
              tooltipButtonLabel={Drupal.t('Persons responsible for operations')}
              tooltipText={Drupal.t('If you want to add, delete or change people, save the application as a draft and go to maintain the people\'s information in your own data.')}
            >
              <Select
                id='contact_person'
                label={Drupal.t('Select official')}
                options={[
                  { value: '1', label: 'Option 1' },
                  { value: '2', label: 'Option 2' },
                  { value: '3', label: 'Option 3' },
                ]}
                placeholder={Drupal.t('-Select-')}
                // required
              />
            </Fieldset>
          </div>
        </div>
      </section>
    </>
  );
};

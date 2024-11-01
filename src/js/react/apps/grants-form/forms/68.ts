import { AdditionalInformationAndRules, AdditionalInformationAndRulesSchema } from '../steps/AdditionalInformationAndRules';
import { ApplicantInfo, ApplicantInfoSchema } from '../steps/ApplicantInfo';

export const Form = [
  {
    label: Drupal.t('Applicant details'),
    render: ApplicantInfo,
    schema: ApplicantInfoSchema
  },
  {
    label: Drupal.t('Grant details'),
    render: ApplicantInfo,
    schema: ApplicantInfoSchema
  },
  {
    label: Drupal.t('Activities of the community'),
    render: ApplicantInfo,
    schema: ApplicantInfoSchema
  },
  {
    label: Drupal.t('Additional information and attachments'),
    render: AdditionalInformationAndRules,
    schema: AdditionalInformationAndRulesSchema
  },
];

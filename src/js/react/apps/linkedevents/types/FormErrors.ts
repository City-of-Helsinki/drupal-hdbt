import type { AddressSearchErrorType } from '@/react/common/helpers/addressSearchError';

type FormErrors = {
  invalidEndDate: boolean;
  invalidStartDate: boolean;
  invalidAddress: false | AddressSearchErrorType;
};

export default FormErrors;

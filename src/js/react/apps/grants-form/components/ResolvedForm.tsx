import React, { Fragment, ReactElement } from 'react';
import { FormProps } from '../types/FormProps';
import { FormNotFoundError } from './FormNotFoundError';
import { StepState } from 'hds-react';
import { FormConfig } from '../types/FormConfig';
import { ApplicantInfo, ApplicantInfoSchema } from '../steps/ApplicantInfo';
import { z, ZodAny } from 'zod';
import { register } from 'module';
import { useAtomValue } from 'jotai';
import { Stepper } from './Stepper';
import { BaseStepWrapper } from './BaseStepWrapper';
import { getCurrentStepAtom } from '../store';

type ResolvedFormProps = {
  form: string;
  formConfig: FormConfig,
}

const ResolvedForm = ({
  form,
  formConfig,
}: ResolvedFormProps) => {
  const step = useAtomValue(getCurrentStepAtom);

  return (
    <Fragment>
      <Stepper />
      {step < formConfig.length - 2 &&
        <BaseStepWrapper>
          {React.createElement(formConfig[step].render)}
        </BaseStepWrapper>
      }
      {
        step === formConfig.length - 2 &&
        React.createElement(formConfig[step].render)
      }
    </Fragment>
  )
}

export default ResolvedForm;

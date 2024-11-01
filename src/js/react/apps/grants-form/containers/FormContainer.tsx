import ResolvedForm from '../components/ResolvedForm';
import { ApplicantInfo, ApplicantInfoSchema } from '../steps/ApplicantInfo';
import { ConsentGroupDataTable, Stepper, StepState } from 'hds-react';
import { FormConfig } from '../types/FormConfig';
import { FormNotFoundError } from '../components/FormNotFoundError';
import { ReactElement, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ATVData } from '../types/ATVData';
import { useSetAtom } from 'jotai';
import { initializeFormStateAtom } from '../store';

type FormContainerProps = {
  applicationNumber: string;
  atvData: ATVData;
  form: string;
  formConfig: FormConfig;
}

const buildSchema = (config: FormConfig) => {
  const schemaDeclarations = z.object({});

  return schemaDeclarations;
};

const FormContainer = ({
  applicationNumber,
  atvData,
  form,
  formConfig,
}: FormContainerProps) => {
  const [page, setPage] = useState(0);
  const initializeFormState = useSetAtom(initializeFormStateAtom);

  useEffect(() => {
    initializeFormState(formConfig, 0, new Set([0]));
  }, []);

  const submitForm = (data: any) => {
    console.log(data);
  };

  return (
    <div className='container'>
      <ResolvedForm {...{ form, formConfig, page, setPage }} />
    </div>
  );
}

export default FormContainer;

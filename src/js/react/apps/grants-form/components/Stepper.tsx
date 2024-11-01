import { useAtomValue, useSetAtom } from 'jotai';
import { Stepper as HDSStepper } from 'hds-react';

import { getCurrentStepAtom, getStepsAtom, setPageAtom } from '../store';

export const Stepper = () => {
  const currentStep = useAtomValue(getCurrentStepAtom);
  const steps = useAtomValue(getStepsAtom);
  const setPage  = useSetAtom(setPageAtom);

  return (
    <HDSStepper
      className='grants-stepper'
      language={drupalSettings.path.currentLanguage}
      steps={steps}
      selectedStep={currentStep}
      onStepClick={(event, stepIndex) => setPage(stepIndex)}
      theme={{
        '--hds-step-content-color': 'var(--color-black)',
        '--hds-stepper-color': 'var(--color-black)',
        '--hds-stepper-focus-border-color': 'var(--color-black)',
        '--hds-not-selected-step-label-color': 'var(--color-black)',
      }}
    />
  )
};

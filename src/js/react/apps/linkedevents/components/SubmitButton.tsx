import { Button } from 'hds-react';

type SubmitButtonProps = {
  disabled: boolean;
};

function SubmitButton({ disabled }: SubmitButtonProps) {
  return (
    <Button className='hdbt-search--react__submit-button event-list__submit-button' disabled={disabled} type='submit'>
      {Drupal.t('Search', {}, { context: 'React search: submit button label' })}
    </Button>
  );
}

export default SubmitButton;

import { Button } from 'hds-react';

type SubmitButtonProps = {
  disabled: boolean;
}

const SubmitButton = ({ disabled }: SubmitButtonProps) => (
    <div className='news-form__submit'>
      <Button
        className='news-form__submit-button'
        disabled={disabled}
        type='submit'
        variant='primary'
      >
        {Drupal.t('Filter', {}, { context: 'News search' })}
      </Button>
    </div>
  );

export default SubmitButton;

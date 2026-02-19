import {
  Button,
  ButtonVariant,
  Checkbox,
  Dialog,
  Fieldset,
  IconBell,
  Notification,
  NotificationSize,
  RadioButton,
  TextInput,
} from 'hds-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultRadioButtonStyle } from '@/react/common/constants/radioButtonStyle';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import { primaryButtonTheme, secondaryButtonTheme } from '@/react/common/constants/buttonTheme';
import Tags from '@/react/common/Tags';
import type TagType from '@/types/TagType';

type FormError = { message: string; visible: boolean };

export type NotificationMethod = 'email' | 'sms' | 'email_sms';

type FormErrorContainer = {
  allVisible?: boolean;
  email?: FormError;
  phone?: FormError;
  termsAgreed?: FormError;
} | null;

interface SearchMonitorTexts {
  tosCheckboxLabel: string | undefined;
  tosLinkText: string | undefined;
  tosLinkUrl: string | undefined;
  instructionsLinkUrl?: string;
  noSelectionsNotification: string | undefined;
}

interface SearchMonitorProps {
  /** Subscribe endpoint */
  apiUrl: string;
  dialogTargetRef: React.RefObject<HTMLDivElement>;
  /** Notification methods the user can choose from. Defaults to ['email']. */
  enabledNotificationMethods?: NotificationMethod[];
  selectionTags: TagType[];
  /** Form translations supplied by the application. */
  texts: SearchMonitorTexts;
  /** The user query */
  elasticQuery: string;
  /** Set to true if the query can contain user data. */
  secureQuery?: true;
}

const emailLabel: string = Drupal.t('Email address', {}, { context: 'Search monitor' });
const phoneLabel: string = Drupal.t('Phone number', {}, { context: 'Search monitor' });
const buttonLabel: string = Drupal.t('Save your search', {}, { context: 'Search monitor' });
const tosLinkSuffix: string = Drupal.t('the link opens in a new tab, pdf', {}, { context: 'Search monitor' });
const errorAriaLabel = Drupal.t('Notification', {}, { context: 'Search monitor' });
const idTitle = 'hdbt-search__search-monitor__header';

/**
 * Helper hook for notification method radio buttons.
 */
function useNotificationMethod(enabledMethods: NotificationMethod[]) {
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>(enabledMethods[0]);

  const showEmail = notificationMethod === 'email' || notificationMethod === 'email_sms';
  const showPhone = notificationMethod === 'sms' || notificationMethod === 'email_sms';
  const showRadioButtons = enabledMethods.length > 1;

  return [notificationMethod, setNotificationMethod, showEmail, showPhone, showRadioButtons] as const;
}

const SearchMonitor = ({
  apiUrl,
  dialogTargetRef,
  enabledNotificationMethods = ['email'],
  elasticQuery,
  selectionTags,
  texts,
  secureQuery,
}: SearchMonitorProps) => {
  const openDialogButtonRef = useRef(null);

  // Form validation states
  const [errors, setErrors] = useState<FormErrorContainer>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [notificationMethod, setNotificationMethod, showEmail, showPhone, showRadioButtons] =
    useNotificationMethod(enabledNotificationMethods);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (errors && Object.keys(errors).length > 0) {
      setErrors({ ...errors, allVisible: true });

      const errorList = Object.entries(errors)
        .filter(([key, error]) => key !== 'allVisible' && error)
        .map(([key, error]) => {
          if ((key === 'termsAgreed' && !termsAgreed) || (key === 'email' && !email) || (key === 'phone' && !phone)) {
            const fieldLabel =
              key === 'email'
                ? emailLabel
                : key === 'phone'
                  ? phoneLabel
                  : Drupal.t('Terms of service', {}, { context: 'Search monitor' });
            return `${Drupal.t('The choice is mandatory', {}, { context: 'Search monitor' })}: ${fieldLabel}`;
          }

          return (error as FormError).message;
        });
      setErrorMessages(errorList);

      return;
    }

    const requestBody = {
      elasticQuery: btoa(elasticQuery),
      // Store the query in ATV if it contains user data.
      elasticQueryAtv: !!secureQuery,
      query: window.location.pathname + window.location.search,
      email: showEmail ? email : null,
      sms: showPhone ? phone : null,
      searchDescription: selectionTags.map(({ tag }) => tag).join(', '),
    };

    // Disable the button after submitting to prevent double submits
    const submitButton = document.getElementById('hdbt-search__search-monitor__submit-button');
    submitButton?.setAttribute('disabled', 'true');

    try {
      // Send form to Hakuvahti subscribe service
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Oops, error from backend
      if (!response.ok) {
        setErrorMessages([Drupal.t('Saving search failed. Please try again.', {}, { context: 'Search monitor' })]);
        return;
      }

      // Release submit locks and show success page
      setSubmitted(true);
      setErrorMessages([]);
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  };

  // This tackles the issue that focus moves constantly to the error message for example.
  useEffect(() => {
    setErrors((prevErrors) => {
      const formErrors: FormErrorContainer = {};
      if (!termsAgreed) {
        formErrors.termsAgreed = {
          message: `${Drupal.t('The choice is mandatory', {}, { context: 'Search monitor' })}.`,
          visible: prevErrors?.allVisible || prevErrors?.email?.visible || false,
        };
      }

      if (showEmail) {
        if (!email) {
          formErrors.email = {
            message: `${Drupal.t('This field is mandatory', {}, { context: 'Search monitor' })}.`,
            visible: prevErrors?.allVisible || prevErrors?.email?.visible || false,
          };
        }

        // Prevent invalid email address
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
          formErrors.email = {
            message: Drupal.t(
              'The email address you entered is not in the right format.',
              {},
              { context: 'Search monitor' },
            ),
            visible: prevErrors?.allVisible || prevErrors?.email?.visible || false,
          };
        }
      }

      if (showPhone) {
        if (!phone) {
          formErrors.phone = {
            message: `${Drupal.t('This field is mandatory', {}, { context: 'Search monitor' })}.`,
            visible: prevErrors?.allVisible || prevErrors?.phone?.visible || false,
          };
        }

        const phoneRegex = /^\+?[0-9\s-]{6,}$/;
        if (phone && !phoneRegex.test(phone)) {
          formErrors.phone = {
            message: Drupal.t(
              'The phone number you entered is not in the right format.',
              {},
              { context: 'Search monitor' },
            ),
            visible: prevErrors?.allVisible || prevErrors?.phone?.visible || false,
          };
        }
      }

      return Object.keys(formErrors).length > 0 ? formErrors : null;
    });
  }, [email, phone, termsAgreed, showEmail, showPhone]);

  const resolvedInstructionsLinkUrl = texts.instructionsLinkUrl;

  const emailError =
    (errors?.allVisible && errors?.email) || errors?.email?.visible ? errors?.email.message : undefined;
  const phoneError =
    (errors?.allVisible && errors?.phone) || errors?.phone?.visible ? errors?.phone.message : undefined;
  const termsError =
    (errors?.allVisible && errors?.termsAgreed) || errors?.termsAgreed?.visible
      ? errors?.termsAgreed.message
      : undefined;

  return (
    <>
      <Button
        aria-controls='hdbt-search__search-monitor__content'
        aria-expanded={isFormVisible}
        className='hdbt-search__search-monitor__button'
        iconStart={<IconBell />}
        onClick={(event: React.MouseEvent) => {
          event.preventDefault();
          setIsFormVisible(!isFormVisible);
        }}
        ref={openDialogButtonRef}
        theme={secondaryButtonTheme}
        type='button'
        variant={ButtonVariant.Secondary}
      >
        {buttonLabel}
      </Button>

      <Dialog
        aria-labelledby={idTitle}
        aria-describedby={Drupal.t('Saved search', {}, { context: 'Search monitor' })}
        className='hdbt-search__search-monitor__content'
        close={() => setIsFormVisible(false)}
        closeButtonLabelText={Drupal.t('Close the order form', {}, { context: 'Search monitor' })}
        id='hdbt-search__search-monitor__content'
        isOpen={isFormVisible}
        focusAfterCloseRef={openDialogButtonRef}
        targetElement={dialogTargetRef.current || undefined}
      >
        {submitted ? (
          <>
            <Dialog.Header
              className='hdbt-search__search-monitor__heading'
              id={idTitle}
              title={Drupal.t(
                'You are almost done saving your search',
                {},
                { context: 'Search monitor submitted header' },
              )}
            />
            <Dialog.Content>
              <form className='hdbt-search__search-monitor' onSubmit={() => setIsFormVisible(false)}>
                <p>
                  {Drupal.t(
                    'Please confirm your saved search with the confirmation link sent to your email address.',
                    {},
                    { context: 'Search monitor submitted content' },
                  )}
                </p>
                <div className='hdbt-search__search-monitor__buttons-container'>
                  <Button
                    className='hdbt-search__search-monitor__cancel-button'
                    theme={primaryButtonTheme}
                    type='submit'
                    variant={ButtonVariant.Primary}
                  >
                    {Drupal.t('Close')}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </>
        ) : (
          <>
            <Dialog.Header
              className='hdbt-search__search-monitor__heading'
              id={idTitle}
              title={Drupal.t('Receive search results by email', {}, { context: 'Search monitor' })}
            />
            <Dialog.Content>
              <form noValidate onSubmit={onSubmit} className='hdbt-search__search-monitor'>
                <p>
                  {Drupal.t(
                    'Carry out a search according to your specifications and then save your search.',
                    {},
                    { context: 'Search monitor content' },
                  )}
                </p>
                <p>{`
                  ${Drupal.t('You can save as many searches as you want.', {}, { context: 'Search monitor content' })}
                  ${Drupal.t(
                    'You will receive email alerts about new search results up to once a day',
                    {},
                    { context: 'Search monitor content' },
                  )}
                `}</p>

                {resolvedInstructionsLinkUrl && (
                  <p>
                    <a href={resolvedInstructionsLinkUrl} target='_blank' rel='noreferrer'>
                      {Drupal.t(
                        'More detailed instructions on how to use saved searches',
                        {},
                        { context: 'Search monitor instructions link' },
                      )}
                    </a>
                  </p>
                )}

                {errorMessages.length > 0 && (
                  <Notification
                    className='hdbt-search__search-monitor__error'
                    label={Drupal.t('Please check these selections', {}, { context: 'Search monitor' })}
                    size={NotificationSize.Medium}
                    type='error'
                    notificationAriaLabel={errorAriaLabel}
                  >
                    <ul>
                      {errorMessages.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </Notification>
                )}

                <section
                  aria-labelledby='hdbt-search__search-monitor__selections-heading'
                  className='hdbt-search__search-monitor__selections'
                >
                  <h3
                    id='hdbt-search__search-monitor__selections-heading'
                    className='hdbt-search__search-monitor__selections-heading'
                  >
                    {Drupal.t('Your search criteria', {}, { context: 'Search monitor selections heading' })}
                  </h3>
                  <div className='hdbt-search__search-monitor__selection-tags'>
                    <Tags insideCard={false} tags={selectionTags} />
                  </div>
                </section>
                {selectionTags.length === 0 && (
                  <Notification
                    label={Drupal.t(
                      'No search criteria selected',
                      {},
                      { context: 'Search monitor no selections notification title' },
                    )}
                    className='hdbt-search__search-monitor__no-selections'
                    notificationAriaLabel={errorAriaLabel}
                    size={NotificationSize.Small}
                    type='info'
                  >
                    {texts.noSelectionsNotification}
                  </Notification>
                )}

                {showRadioButtons && (
                  <Fieldset
                    className='hdbt-search__search-monitor__notification-methods'
                    heading={Drupal.t('How do you want to receive notifications?', {}, { context: 'Search monitor' })}
                  >
                    {enabledNotificationMethods.includes('email') && (
                      <RadioButton
                        checked={notificationMethod === 'email'}
                        id='hdbt-search__search-monitor__method-email'
                        label={Drupal.t('Email', {}, { context: 'Search monitor notification method' })}
                        name='hdbt-search__search-monitor__notification-method'
                        onChange={() => setNotificationMethod('email')}
                        style={{ ...defaultRadioButtonStyle }}
                        value='email'
                      />
                    )}
                    {enabledNotificationMethods.includes('sms') && (
                      <RadioButton
                        checked={notificationMethod === 'sms'}
                        id='hdbt-search__search-monitor__method-sms'
                        label={Drupal.t('SMS', {}, { context: 'Search monitor notification method' })}
                        name='hdbt-search__search-monitor__notification-method'
                        onChange={() => setNotificationMethod('sms')}
                        style={{ ...defaultRadioButtonStyle }}
                        value='sms'
                      />
                    )}
                    {enabledNotificationMethods.includes('email_sms') && (
                      <RadioButton
                        checked={notificationMethod === 'email_sms'}
                        id='hdbt-search__search-monitor__method-email-sms'
                        label={Drupal.t('Email and SMS', {}, { context: 'Search monitor notification method' })}
                        name='hdbt-search__search-monitor__notification-method'
                        onChange={() => setNotificationMethod('email_sms')}
                        style={{ ...defaultRadioButtonStyle }}
                        value='email_sms'
                      />
                    )}
                  </Fieldset>
                )}

                {showPhone && (
                  <TextInput
                    className='hdbt-search__search-monitor__phone'
                    errorText={phoneError}
                    id='hdbt-search__search-monitor__phone'
                    label={phoneLabel}
                    name='hdbt-search__search-monitor__phone'
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    style={{ ...defaultTextInputStyle }}
                    type='tel'
                    value={phone}
                  />
                )}

                {showEmail && (
                  <TextInput
                    className='hdbt-search__search-monitor__email'
                    errorText={emailError}
                    id='hdbt-search__search-monitor__email'
                    label={emailLabel}
                    name='hdbt-search__search-monitor__email'
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    style={{ ...defaultTextInputStyle }}
                    type='email'
                    value={email}
                  />
                )}

                <a
                  href={texts.tosLinkUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='hdbt-search__search-monitor__terms-link'
                >
                  {texts.tosLinkText} ({tosLinkSuffix})
                </a>

                <Checkbox
                  checked={termsAgreed}
                  className='hdbt-search__search-monitor__terms'
                  errorText={termsError}
                  id='hdbt-search__search-monitor__terms'
                  label={`${texts.tosCheckboxLabel}  *`}
                  name='hdbt-search__search-monitor__terms'
                  onChange={(event) => setTermsAgreed(event.target.checked)}
                  required
                  style={{ ...defaultCheckboxStyle, marginTop: 'var(--spacing-m)' }}
                />

                <div className='hdbt-search__search-monitor__buttons-container'>
                  <Button
                    className='hdbt-search--react__submit-button hdbt-search__search-monitor__submit-button'
                    id='hdbt-search__search-monitor__submit-button'
                    type='submit'
                  >
                    {buttonLabel}
                  </Button>
                  <Button
                    className='hdbt-search__search-monitor__cancel-button'
                    onClick={() => setIsFormVisible(false)}
                    theme={secondaryButtonTheme}
                    type='button'
                    variant={ButtonVariant.Secondary}
                  >
                    {Drupal.t('Cancel')}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </>
        )}
      </Dialog>
    </>
  );
};

export default SearchMonitor;

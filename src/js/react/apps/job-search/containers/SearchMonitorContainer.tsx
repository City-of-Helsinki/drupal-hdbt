// biome-ignore lint/style/useNodejsImportProtocol: @todo UHF-12501/pdfpreventDefault
import { Buffer } from 'buffer';
import {
  Button,
  ButtonPresetTheme,
  ButtonVariant,
  Checkbox,
  Dialog,
  IconBell,
  Notification,
  NotificationSize,
  TextInput,
} from 'hds-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import useQueryString from '../hooks/useQueryString';
import { useVisibleSelections } from '../hooks/useVisibleSelections';
import { useSelectionTags } from '../hooks/useSelectionTags';
import Tags from '@/react/common/Tags';

type FormError = { message: string; visible: boolean };

type FormErrorContainer = {
  allVisible?: boolean;
  email?: FormError;
  termsAgreed?: FormError;
} | null;

const SearchMonitorContainer = ({
  dialogTargetRef,
}: {
  dialogTargetRef: React.RefObject<HTMLDivElement>;
}) => {
  const openDialogButtonRef = useRef(null);
  const query = useQueryString();
  const selections = useVisibleSelections();
  const selectionTags = useSelectionTags(selections);

  // Form validation states
  const [errors, setErrors] = useState<FormErrorContainer>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  // ElasticSearch query base64 encoded
  const queryEncoded = Buffer.from(query).toString('base64');
  const searchDescription = '-';

  // Relative url for "query" parameter
  const currentPath = window.location.pathname;
  const currentParams = window.location.search;
  const currentRelativeUrl = currentPath + currentParams;

  const requestBody = {
    elastic_query: queryEncoded,
    query: currentRelativeUrl,
    email,
    search_description: searchDescription,
    lang: window.drupalSettings.path.currentLanguage || 'fi',
  };

  const emailLabel: string = Drupal.t(
    'Email address',
    {},
    { context: 'Search monitor email label' },
  );

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (errors && Object.keys(errors).length > 0) {
      setErrors({ ...errors, allVisible: true });

      const errorString = Object.entries(errors)
        .filter(([key, error]) => key !== 'allVisible' && error)
        .map(([key, error]) => {
          if (
            (key === 'termsAgreed' && !termsAgreed) ||
            (key === 'email' && !email)
          ) {
            return `${Drupal.t(
              'The choice is mandatory: Terms of service',
              {},
              { context: 'Search monitor error terms' },
            )}: ${
              key === 'email'
                ? emailLabel
                : Drupal.t(
                    'Terms of service',
                    {},
                    { context: 'Search monitor terms' },
                  )
            }`;
          }

          return (error as FormError).message;
        })
        .join('\n');
      setErrorMessage(errorString);

      return;
    }

    // Make submit button disabled after submitting to prevent double submits
    const submitButton = document.getElementById(
      'job-search-form__search-monitor__submit-button',
    );
    if (submitButton) {
      submitButton.setAttribute('disabled', 'true');
    }

    // Get csrf token from Drupal
    let sessionToken = '';
    try {
      const response = await fetch('/session/token', { method: 'GET' });

      if (!response.ok) {
        setErrorMessage(`Error getting session token: ${response.statusText}`);
        if (submitButton) {
          submitButton.removeAttribute('disabled');
        }
        return;
      }

      sessionToken = await response.text();
    } catch (error) {
      setErrorMessage(`Error getting session token: ${error}`);
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
      return;
    }

    // Send form to Hakuvahti subscribe service
    const body = JSON.stringify(requestBody);

    // In production this runs under a non-root /path/structure.
    const { host, pathname } = window.location;
    const pathParts = pathname.split('/').slice(0, -1);
    const basePath = pathParts.join('/');

    let apiPath = `${basePath}/hakuvahti/subscribe`;
    if (host.includes('docker.so')) {
      apiPath = '/hakuvahti/subscribe';
    }
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: sessionToken },
      body,
    });

    // Oops, error from backend
    if (!response.ok) {
      console.warn(response.statusText);
      setErrorMessage(
        Drupal.t(
          'Saving search failed. Please try again.',
          {},
          { context: 'Search monitor error submitting' },
        ),
      );
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
      return;
    }

    // Release submit locks and show success page
    setSubmitted(true);
    setErrorMessage('');

    if (submitButton) {
      submitButton.removeAttribute('disabled');
    }
  };

  // This tackles the issue that focus moves constantly to the error message for example.
  useEffect(() => {
    setErrors((prevErrors) => {
      const formErrors: FormErrorContainer = {};
      if (!termsAgreed) {
        formErrors.termsAgreed = {
          message: `${Drupal.t(
            'The choice is mandatory',
            {},
            { context: 'Search monitor error' },
          )}.`,
          visible:
            prevErrors?.allVisible || prevErrors?.email?.visible || false,
        };
      }

      if (!email) {
        formErrors.email = {
          message: `${Drupal.t(
            'This field is mandatory',
            {},
            { context: 'Search monitor error' },
          )}.`,
          visible:
            prevErrors?.allVisible || prevErrors?.email?.visible || false,
        };
      }

      // Prevent invalid email address
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email && !regex.test(email)) {
        formErrors.email = {
          message: Drupal.t(
            'The email address you entered is not in the right format.',
            {},
            { context: 'Search monitor error email' },
          ),
          visible:
            prevErrors?.allVisible || prevErrors?.email?.visible || false,
        };
      }

      return Object.keys(formErrors).length > 0 ? formErrors : null;
    });
  }, [email, termsAgreed]);

  const formHeader: string = Drupal.t(
    'Receive search results by email',
    {},
    { context: 'Search monitor header' },
  );
  const closeLabel: string = Drupal.t(
    'Close the order form',
    {},
    { context: 'Search monitor close label' },
  );
  const descriptionHeader: string = Drupal.t(
    'Saved search',
    {},
    { context: 'Search monitor content title' },
  );
  const buttonLabel: string = Drupal.t(
    'Save your search',
    {},
    { context: 'Search monitor submit button label' },
  );
  const errorLabel: string = Drupal.t(
    'Please check these selections',
    {},
    { context: 'Search monitor error label' },
  );
  const tosCheckboxLabel: string =
    window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_checkbox_label;
  const tosLinkLabel: string =
    window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_link_text;
  const tosLinkUrl: string =
    window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_link_url;
  const tosLinkSuffix: string = Drupal.t(
    'The link opens in a new tab',
    {},
    {
      context:
        'Explanation for users that the link opens in a new tab instead of the expected current tab',
    },
  );
  const errorAriaLabel = Drupal.t(
    'Notification',
    {},
    { context: 'Search monitor error message type for screen reader' },
  );

  const idTitle = 'job-search-form__search-monitor__header';

  const emailError =
    (errors?.allVisible && errors?.email) || errors?.email?.visible
      ? errors?.email.message
      : undefined;
  const termsError =
    (errors?.allVisible && errors?.termsAgreed) || errors?.termsAgreed?.visible
      ? errors?.termsAgreed.message
      : undefined;

  return (
    <>
      <Button
        aria-controls='job-search-form__search-monitor__content'
        aria-expanded={isFormVisible}
        className='job-search-form__search-monitor__button'
        iconStart={<IconBell />}
        onClick={(event: React.MouseEvent) => {
          event.preventDefault();
          setIsFormVisible(!isFormVisible);
        }}
        ref={openDialogButtonRef}
        theme={ButtonPresetTheme.Black}
        type='button'
        variant={ButtonVariant.Secondary}
      >
        {buttonLabel}
      </Button>

      <Dialog
        aria-labelledby={idTitle}
        aria-describedby={descriptionHeader}
        className='job-search-form__search-monitor__content'
        close={() => setIsFormVisible(false)}
        closeButtonLabelText={closeLabel}
        id='job-search-form__search-monitor__content'
        isOpen={isFormVisible}
        focusAfterCloseRef={openDialogButtonRef}
        targetElement={dialogTargetRef.current || undefined}
      >
        {submitted ? (
          <>
            <Dialog.Header
              className='job-search-form__search-monitor__heading'
              id={idTitle}
              title={Drupal.t(
                'You are almost done saving your search',
                {},
                { context: 'Search monitor submitted header' },
              )}
            />
            <Dialog.Content>
              <form
                className='job-search-form__search-monitor'
                onSubmit={() => setIsFormVisible(false)}
              >
                <p>
                  {Drupal.t(
                    'Please confirm your saved search with the confirmation link sent to your email address.',
                    {},
                    { context: 'Search monitor submitted content' },
                  )}
                </p>
                <div className='job-search-form__search-monitor__buttons-container'>
                  <Button
                    className='job-search-form__search-monitor__cancel-button'
                    theme={ButtonPresetTheme.Black}
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
              className='job-search-form__search-monitor__heading'
              id={idTitle}
              title={formHeader}
            />
            <Dialog.Content>
              <form
                onSubmit={onSubmit}
                className='job-search-form__search-monitor'
              >
                <p>
                  {Drupal.t(
                    'Carry out a search according to your specifications and then save your search.',
                    {},
                    { context: 'Search monitor content' },
                  )}
                </p>
                <p>{`
                  ${Drupal.t(
                    'You can save as many searches as you want.',
                    {},
                    { context: 'Search monitor content' },
                  )} 
                  ${Drupal.t(
                    'You will receive email alerts about new search results up to once a day',
                    {},
                    { context: 'Search monitor content' },
                  )}
                `}</p>

                {errorMessage && (
                  <Notification
                    className='job-search-form__search-monitor__error'
                    label={errorLabel}
                    size={NotificationSize.Medium}
                    type='error'
                    notificationAriaLabel={errorAriaLabel}
                  >
                    {errorMessage}
                  </Notification>
                )}

                <section
                  aria-labelledby='job-search-form__search-monitor__selections-heading'
                  className='job-search-form__search-monitor__selections'
                >
                  <h3
                    id='job-search-form__search-monitor__selections-heading'
                    className='job-search-form__search-monitor__selections-heading'
                  >
                    {Drupal.t(
                      'Your search criteria:',
                      {},
                      { context: 'Search monitor selections heading' },
                    )}
                  </h3>
                  <div className='job-search-form__search-monitor__selection-tags'>
                    <Tags insideCard={false} tags={selectionTags} />
                  </div>
                </section>
                {selectionTags.length === 0 && (
                  <Notification
                    label={Drupal.t(
                      'No search criteria selected',
                      {},
                      {
                        context:
                          'Search monitor no selections notification title',
                      },
                    )}
                    className='job-search-form__search-monitor__no-selections'
                    notificationAriaLabel={errorAriaLabel}
                    size={NotificationSize.Small}
                    type='info'
                  >
                    {Drupal.t(
                      'You have not selected any search criteria. You will receive alerts of all new job listings.',
                      {},
                      { context: 'Search monitor no selections notification' },
                    )}
                  </Notification>
                )}

                <TextInput
                  className='job-search-form__search-monitor__email'
                  errorText={emailError}
                  id='job-search-form__search_monitor__email'
                  label={emailLabel}
                  name='job-search-form__search_monitor__email'
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  style={{
                    ...defaultTextInputStyle,
                    marginTop: 'var(--spacing-m)',
                  }}
                  type='email'
                  value={email}
                />

                <a
                  href={tosLinkUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='job-search-form__search-monitor__terms-link'
                >
                  {tosLinkLabel} ({tosLinkSuffix})
                </a>

                <Checkbox
                  checked={termsAgreed}
                  className='job-search-form__search-monitor__terms'
                  errorText={termsError}
                  id='job-search-form__search_monitor__terms'
                  label={`${tosCheckboxLabel}  *`}
                  name='job-search-form__search_monitor__terms'
                  onChange={(event) => setTermsAgreed(event.target.checked)}
                  required
                  style={{
                    ...defaultCheckboxStyle,
                    marginTop: 'var(--spacing-m)',
                  }}
                />

                <div className='job-search-form__search-monitor__buttons-container'>
                  <Button
                    className='hdbt-search--react__submit-button job-search-form__search-monitor__submit-button'
                    id='job-search-form__search-monitor__submit-button'
                    type='submit'
                  >
                    {buttonLabel}
                  </Button>
                  <Button
                    className='job-search-form__search-monitor__cancel-button'
                    onClick={() => setIsFormVisible(false)}
                    theme={ButtonPresetTheme.Black}
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

export default SearchMonitorContainer;

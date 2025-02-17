import { atom, useAtom, useAtomValue } from 'jotai';

import {
  Button,
  ButtonPresetTheme,
  ButtonVariant,
  Checkbox,
  IconAngleDown,
  IconAngleUp,
  Notification,
  NotificationSize,
  TextInput,
} from 'hds-react';
import React, { createRef, useEffect } from 'react';
import { Buffer } from 'buffer';
import URLParams from '../types/URLParams';
import useQueryString from '../hooks/useQueryString';
import { urlAtom, monitorSubmittedAtom } from '../store';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';

// Define new atom for scroll state
const shouldScrollAtom = atom(false);

const SearchMonitorContainer = () => {
  const urlParams: URLParams = useAtomValue(urlAtom);
  const query = useQueryString(urlParams);

  // Form validation states
  const [termsAgreed, setTermsAgreed] = useAtom(receiveNewsletterAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [submitted, setSubmitted] = useAtom(monitorSubmittedAtom);
  const [errorMessage, seterrorMessage] = useAtom(errorAtom);
  const [isFormVisible, setIsFormVisible] = useAtom(isFormVisibleAtom);

  // Scroll state
  const [shouldScroll, setShouldScroll] = useAtom(shouldScrollAtom);

  // ElasticSearch query base64 encoded
  const queryEncoded = Buffer.from(query).toString('base64');
  const searchDescription = '-';

  // Relative url for "query" parameter
  const currentPath = window.location.pathname;
  const currentParams = window.location.search;
  const currentRelativeUrl = currentPath + currentParams;

  const scrollTarget = createRef<HTMLDivElement>();

  const requestBody = {
    elastic_query: queryEncoded,
    query: currentRelativeUrl,
    email,
    search_description: searchDescription,
    lang: window.drupalSettings.path.currentLanguage || 'fi'
  };

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    // Validate stuff to submit form
    if (!termsAgreed) {
      seterrorMessage(Drupal.t('The choice is mandatory: Terms of service', {}, { context: 'Search monitor error terms' }));
      return;
    }

    if (!email) {
      seterrorMessage(Drupal.t('This field is mandatory: Email address', {}, { context: 'Search monitor error email' }));
      return;
    }

    // Make submit button disabled after submitting to prevent double submits
    const submitButton = document.getElementById('job-search-form__search-monitor__submit-button');
    if (submitButton) {
      submitButton.setAttribute('disabled', 'true');
    }

    // Get csrf token from Drupal
    let sessionToken = '';
    try {
      const response = await fetch('/session/token', {
        method: 'GET',
      });

      if (!response.ok) {
        seterrorMessage(
          `Error getting session token: ${response.statusText}`,
        );
        if (submitButton) {
          submitButton.removeAttribute('disabled');
        }
        return;
      }

      sessionToken = await response.text();
    } catch (error) {
      seterrorMessage(`Error getting session token: ${error}`);
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
      headers: {
        'Content-Type': 'application/json',
        'token': sessionToken,
      },
      body
    });

    // Oops, error from backend
    if (!response.ok) {
      console.warn(response.statusText);
      seterrorMessage(Drupal.t('Saving search failed. Please try again.', {}, { context: 'Search monitor error submitting' }));
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
      // Move focus to error message.
      setShouldScroll(true);
      return;
    }

    // Release submit locks and show success page
    setSubmitted(true);
    seterrorMessage('');

    // Move focus to successful message.
    setShouldScroll(true);

    if (submitButton) {
      submitButton.removeAttribute('disabled');
    }
  };

  // Scroll to results when they change.
  useScrollToResults(scrollTarget, shouldScroll);

  // This tackles the issue that focus moves constantly to the error message for example.
  useEffect(() => {
    if (shouldScroll) {
      setShouldScroll(false); // Reset the scroll state after scrolling
    }
  }, [shouldScroll, setShouldScroll]);

  const formHeader: string = Drupal.t('Receive search results by email', {}, { context: 'Search monitor header' });
  const openLabel: string = Drupal.t('Open the order form', {}, { context: 'Search monitor open label' });
  const closeLabel: string = Drupal.t('Close the order form', {}, { context: 'Search monitor close label' });
  const descriptionHeader: string = Drupal.t('Saved search', {}, { context: 'Search monitor content title' });
  const descriptionFirstPart: string = Drupal.t('To receive job alerts, carry out the search desired and then save your search. This will allow you to receive email notifications about any new matches.', {}, { context: 'Search monitor content' });
  const descriptionSecondPart: string = Drupal.t('You can save as many searches as you like. You can delete the saved search via the link in the email messages.', {}, { context: 'Search monitor content' });
  const emailLabel: string = Drupal.t('Email address', {}, { context: 'Search monitor email label' });
  const buttonLabel: string = Drupal.t('Save your search', {}, { context: 'Search monitor submit button label' });
  const thankYouHeader: string = Drupal.t('Your search has been saved', {}, { context: 'Search monitor thank you header' });
  const thankYouMessage: string = Drupal.t('You will receive a confirmation link by email. You can activate the saved search via the link.', {}, { context: 'Search monitor thank you message' });
  const errorLabel: string = Drupal.t('Please check these selections', {}, { context: 'Search monitor error label' });
  const tosCheckboxLabel: string = window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_checkbox_label;
  const tosLinkLabel: string = window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_link_text;
  const tosLinkUrl: string = window.drupalSettings.helfi_rekry_job_search.hakuvahti_tos_link_url;
  const tosLinkSuffix: string = Drupal.t('The link opens in a new tab', {}, {context: 'Explanation for users that the link opens in a new tab instead of the expected current tab'});

  const customEmailStyles = {
    marginTop: 'var(--spacing-m)',
  };

  const customCheckboxStyles = {
    '--background-unselected': 'var(--color-white)',
    '--background-selected': 'var(--color-black)',
    marginTop: 'var(--spacing-m)',
  };

  const customButtonStyles = {
    '--border-color-focus': 'var(--color-black)',
    backgroundColor: 'transparent',
  };

  return (
    <form onSubmit={onSubmit} className="job-search-form__search-monitor">
      {!submitted && (
        <>
          <h3 className='job-search-form__search-monitor__heading'>{formHeader}</h3>
          <Button
            aria-controls='job-search-form__search-monitor__content'
            aria-expanded={isFormVisible}
            iconStart={isFormVisible ? <IconAngleUp /> : <IconAngleDown />}
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              setIsFormVisible(!isFormVisible);
            }}
            style={customButtonStyles}
            theme={ButtonPresetTheme.Black}
            type="button"
            variant={ButtonVariant.Supplementary}
          >
            {isFormVisible ? closeLabel : openLabel}
          </Button>

          <div id='job-search-form__search-monitor__content' className='job-search-form__search-monitor__content'
               aria-hidden={!isFormVisible}>
            <h4 className='job-search-form__search-monitor__content__heading'>{descriptionHeader}</h4>
            <p>{descriptionFirstPart}</p>
            <p>{descriptionSecondPart}</p>

            {errorMessage &&
              <Notification
                className='job-search-form__search-monitor__error'
                label={errorLabel}
                ref={scrollTarget}
                size={NotificationSize.Medium}
                type='error'
                notificationAriaLabel={Drupal.t('Notification', {}, {context: 'Search monitor error message type for screen reader'})}
              >
                {errorMessage}
              </Notification>
            }

            <TextInput
              className='job-search-form__search-monitor__email'
              id='job-search-form__search_monitor__email'
              label={emailLabel}
              name='job-search-form__search_monitor__email'
              onChange={(event) => setEmail(event.target.value)}
              required
              style={customEmailStyles}
              type='email'
              value={email}
            />

            <p><a href={tosLinkUrl} target='_blank' rel="noreferrer"  className='job-search-form__search-monitor__terms-link'>{tosLinkLabel} ({tosLinkSuffix})</a></p>
            <Checkbox
              checked={termsAgreed}
              className='job-search-form__search-monitor__terms'
              id='job-search-form__search_monitor__terms'
              label={tosCheckboxLabel}
              name='job-search-form__search_monitor__terms'
              onChange={(event) => setTermsAgreed(event.target.checked)}
              required
              style={customCheckboxStyles}
            />

            <Button
              className='hdbt-search--react__submit-button job-search-form__search-monitor__submit-button'
              id='job-search-form__search-monitor__submit-button'
              style={{
                marginBottom: '0',
                marginTop: 'var(--spacing-l)',
              }}
              type='submit'
            >
              {buttonLabel}
            </Button>
          </div>
        </>
      )}

      {submitted &&
        <>
          <h3 className='job-search-form__search-monitor__heading' ref={scrollTarget}>{thankYouHeader}</h3>
          <p>{thankYouMessage}</p>
        </>
      }
    </form>
  );
};

const emailAtom = atom('');
const receiveNewsletterAtom = atom(false);
const isFormVisibleAtom = atom(false);
const errorAtom = atom('');

export default SearchMonitorContainer;

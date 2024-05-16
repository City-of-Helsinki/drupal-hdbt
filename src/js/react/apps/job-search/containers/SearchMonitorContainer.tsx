import { atom, useAtom, useAtomValue } from 'jotai';

import { Accordion, Button, Checkbox, TextInput, Notification } from 'hds-react';
import React from 'react';
import { Buffer } from 'buffer';
import URLParams from '../types/URLParams';
import useQueryString from '../hooks/useQueryString';
import { urlAtom } from '../store';

const SearchMonitorContainer = () => {
  const urlParams: URLParams = useAtomValue(urlAtom);
  const query = useQueryString(urlParams);

  // Form validation states
  const [termsAgreed, setTermsAgreed] = useAtom(receiveNewsletterAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [submitted, setSubmitted] = useAtom(submittedAtom);
  const [errorMessage, seterrorMessage] = useAtom(errorAtom);

  // ElasticSearch query base64 encoded
  const queryEncoded = Buffer.from(query, 'binary').toString('base64');
  const searchDescription = '-';
  const lang = '';

  // Relative url for "query" parameter
  const currentPath = window.location.pathname;
  const currentParams = window.location.search;
  const currentRelativeUrl = currentPath + currentParams;

  const requestBody = {
    elastic_query: queryEncoded,
    query: currentRelativeUrl,
    email,
    search_description: searchDescription,
    // lang is filled by Drupal module
    lang
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
    const response = await fetch('/hakuvahti/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': sessionToken,
      },
      body
    });

    // Oops, error from backend
    if (!response.ok) {
      seterrorMessage(
        `Error submitting form: ${response.statusText}`,
      );
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
      return;
    }

    // Release submit locks and show success page
    setSubmitted(true);
    seterrorMessage('');
    if (submitButton) {
      submitButton.removeAttribute('disabled');
    }
  };

  const formHeader: string = Drupal.t('Receive search results by email', {}, { context: 'Search monitor header' });
  const accordionHeader: string = Drupal.t('Open', {}, { context: 'Search monitor accordion title' });
  const descriptionHeader: string = Drupal.t('Saved search', {}, { context: 'Search monitor content title' });
  const descriptionFirstPart: string = Drupal.t('Save the search you make so that you can receive an email notification of new results matching your search criteria.', {}, { context: 'Search monitor content' });
  const descriptionSecondPart: string = Drupal.t('You can save as many searches as you like. You can delete the saved search via the link in the email messages.', {}, { context: 'Search monitor content' });
  const searchCriteriaHeader: string = Drupal.t('Search criteria', {}, { context: 'Search monitor search criteria title' });
  const emailLabel: string = Drupal.t('Email address', {}, { context: 'Search monitor email label' });
  const acceptTermsLabel: string = Drupal.t('Accept the terms and conditions.', {}, { context: 'Search monitor terms label' });
  const buttonLabel: string = Drupal.t('Save your search', {}, { context: 'Search monitor submit button label' });
  const thankYouHeader: string = Drupal.t('Your search has been saved', {}, { context: 'Search monitor thank you header' });
  const thankYouMessage: string = Drupal.t('You will receive a confirmation link by email. You can activate the saved search via the link.', {}, { context: 'Search monitor thank you message' });
  const errorLabel: string = Drupal.t('Please check these selections', {}, { context: 'Search monitor error label' });

  return (
    <form onSubmit={onSubmit} className="job-search-form__search-monitor">
      {!submitted && (
        <>
          <h3 className='job-search-form__search-monitor__heading'>{formHeader}</h3>
          <Accordion
            className='job-search-form__search-monitor__accordion'
            closeButton={false}
            size='s'
            headingLevel={3}
            heading={accordionHeader}
            language={window.drupalSettings.path.currentLanguage || 'fi'}
            theme={{
              '--header-font-size': 'var(--fontsize-heading-xxs)',
              '--header-line-height': 'var(--lineheight-s)',
              '--border-color': 'transparent',
            }}
          >
            <h4>{descriptionHeader}</h4>
            <p>{descriptionFirstPart}</p>
            <p>{descriptionSecondPart}</p>

            {errorMessage &&
              <Notification
                type='error'
                size='default'
                label={errorLabel}
              >
                {errorMessage}
              </Notification>
            }

            <p className='job-search-form__search-monitor__search-criteria'>
              <b>{searchCriteriaHeader}:</b><br/>
              {searchDescription}
            </p>

            <TextInput
              className='job-search-form__search-monitor__email'
              id='job-search-form__search_monitor__email'
              label={emailLabel}
              name='job-search-form__search_monitor__email'
              type='email'
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              required
            />

            <Checkbox
              className='job-search-form__search-monitor__terms'
              label={acceptTermsLabel}
              id='job-search-form__search_monitor__terms'
              onChange={(event) => setTermsAgreed(event.target.checked)}
              checked={termsAgreed}
              name='job-search-form__search_monitor__terms'
              required
            />

            <Button className='hdbt-search--react__submit-button job-search-form__search-monitor__submit-button' type='submit' id='job-search-form__search-monitor__submit-button'>
              {buttonLabel}
            </Button>
          </Accordion>
        </>
      )}

      {submitted &&
        <>
          <h3 className='job-search-form__search-monitor__heading'>{thankYouHeader}</h3>
          <p>{thankYouMessage}</p>
        </>
      }
    </form>
  );
};

const emailAtom = atom('');
const receiveNewsletterAtom = atom(false);
const submittedAtom = atom(false);
const errorAtom = atom('');

export default SearchMonitorContainer;

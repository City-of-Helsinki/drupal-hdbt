import { atom, useAtom, useAtomValue } from 'jotai';

import {Accordion, Button, Checkbox, TextInput} from 'hds-react';
import React from 'react';
import { Buffer } from 'buffer';
import URLParams from '../types/URLParams';
import useQueryString from '../hooks/useQueryString';
import {
  urlAtom,
} from '../store';

const SearchMonitorContainer = () => {
  const urlParams: URLParams = useAtomValue(urlAtom);
  const query = useQueryString(urlParams);

  // Form validation states
  const [termsAgreed, setTermsAgreed] = useAtom(receiveNewsletterAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [submitted, setSubmitted] = useAtom(submittedAtom);
  const [errorEmail, setErrorEmail] = useAtom(errorAtom);

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
      setErrorEmail('Terms of use must be agreed.');
      return;
    }

    if (!email) {
      setErrorEmail('Email is required.');
      return;
    }

    // Make submit button disabled after submitting to prevent double submits
    const submitButton = document.getElementById('hakuvahti-submit');
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
        setErrorEmail(
          `Error getting session token: ${response.statusText}`,
        );
        if (submitButton) {
          submitButton.removeAttribute('disabled');
        }
        return;
      }

      sessionToken = await response.text();
    } catch (error) {
      setErrorEmail(`Error getting session token: ${error}`);
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
      setErrorEmail(
        `Error submitting form: ${response.statusText}`,
      );
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
      return;
    }

    // Release submit locks and show success page
    setSubmitted(true);
    setErrorEmail('');
    if (submitButton) {
      submitButton.removeAttribute('disabled');
    }
  };

  return (
    <form onSubmit={onSubmit} className="job-search-form__search-monitor">
      {!submitted && (
        <Accordion
          className='job-search-form__search-monitor__accordion'
          size='s'
          headingLevel={3}
          heading={Drupal.t('Receive search results by email', {}, { context: 'Search monitor title' })}
          language={window.drupalSettings.path.currentLanguage || 'fi'}
          theme={{
            '--header-font-size': 'var(--fontsize-heading-xxs)',
            '--header-line-height': 'var(--lineheight-s)',
            '--border-color': 'transparent',
          }}
        >
          <h4>{Drupal.t('Saved search', {}, { context: 'Search monitor content title' })}</h4>
          <p>{Drupal.t('Save the search you make so that you can receive an email notification of new results matching your search criteria.', {}, { context: 'Search monitor content' })}</p>
          <p>{Drupal.t('You can save as many searches as you like. You can delete the saved search via the link in the email messages.', {}, { context: 'Search monitor content' })}</p>

          <p>Hakuehdot:</p>
          <span>{searchDescription}</span>

          <TextInput
            className='job-search-form__search-monitor__email'
            id='job-search-form__search_monitor__email'
            label={Drupal.t('Email address', {}, { context: 'Search monitor email label' })}
            name='job-search-form__search_monitor__email'
            type='email'
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />

          <Checkbox
            className='job-search-form__search-monitor__terms'
            label={Drupal.t('Accept the terms and conditions.', {}, { context: 'Search monitor terms label' })}
            id='job-search-form__search_monitor__terms'
            onChange={(event) => setTermsAgreed(event.target.checked)}
            checked={termsAgreed}
            name='job-search-form__search_monitor__terms'
          />

          {errorEmail && <p>{errorEmail}</p>}

          <Button className='hdbt-search--react__submit-button job-search-form__search-monitor__submit-button' type='submit'>
            {Drupal.t('Save your search', {}, { context: 'Search monitor submit button label' })}
          </Button>
        </Accordion>
      )}

      {submitted && <p>Thank you for subscribing.</p>}
    </form>
  );
};

const emailAtom = atom('');
const receiveNewsletterAtom = atom(false);
const submittedAtom = atom(false);
const errorAtom = atom('');

export default SearchMonitorContainer;

import { atom, useAtom, useAtomValue } from 'jotai';

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
    const [isFormVisible, setIsFormVisible] = useAtom(isFormVisibleAtom);

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

    // TODO: HDS style this
    return (
        <form onSubmit={onSubmit}>
            {!submitted && (
                <fieldset>
                    <legend>Tilaa hakuvahti sähköpostiisi</legend>

                    <div>
                        <button type="button"
                            onClick={(event: React.MouseEvent) => {
                                event.preventDefault();
                                setIsFormVisible(!isFormVisible);
                            }}
                        >
                            {isFormVisible ? 'Sulje' : 'Avaa'}
                        </button>
                    </div>

                    {isFormVisible && (
                        <div id="searchMonitorFormContent">
                            <div>
                                <h3>Hakuvahti</h3>
                                <p>Tallenna tekemäsi haku hakuvahdiksi, niin saat sähköpostiisi tiedon uusista osumista.</p>
                                <p>Voit luoda niin monta hakuvahtia kuin haluat ja poistaa hakuvahdin sähköpostien mukana tulevasta linkistä.</p>
                            </div>

                            <div>
                                <p>
                                    <p>Hakuehdot:</p>
                                    <span>{searchDescription}</span>
                                </p>

                                <p>
                                    <span>Sähköposti:</span>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </p>
                                <p>
                                    <input
                                        type="checkbox"
                                        checked={termsAgreed}
                                        onChange={(event) => setTermsAgreed(event.target.checked)}
                                    />
                                    Hyväksy <a href="/pages/terms-and-conditions" target="_blank" rel="noreferrer">käyttöehdot.</a>
                                </p>
                                {errorEmail && <p>{errorEmail}</p>}
                                <p>
                                    <button id="hakuvahti-submit" type="submit">Tilaa hakuvahti</button>
                                </p>
                            </div>
                        </div>
                    )}
                </fieldset>
            )}

            {submitted && <p>Thank you for subscribing.</p>}
        </form>
    );
};

const emailAtom = atom('');
const receiveNewsletterAtom = atom(false);
const submittedAtom = atom(false);
const isFormVisibleAtom = atom(false);
const errorAtom = atom('');

export default SearchMonitorContainer;

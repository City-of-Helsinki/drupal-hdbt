import LocalStorageManager from './localStorageManager';
import ClientHelpers from './client-helpers';

(Drupal => {
  Drupal.behaviors.closable_surveys = {
    attach: function attach() {
      // Move the DOM element with id 'block-surveys' right after the dialog-off-canvas-main-canvas if it is present.
      // If not move it as last element inside the body element so that the header (h1, h2, etc.) structure will be
      // correct.
      const blockSurveys = document.getElementById('block-surveys');
      const offCanvas = document.getElementById('dialog-off-canvas-main-canvas');
      if (blockSurveys) {
        if (offCanvas) {
          offCanvas.parentNode.insertBefore(blockSurveys, offCanvas.nextSibling);
        } else {
          document.body.insertBefore(blockSurveys, document.body.lastChild);
        }
      }

      const survey = document.getElementById('helfi-survey__container');
      if (!survey) return;

      const root = document.documentElement;
      const surveyDelay = 2000;
      const surveyButtons = document.querySelectorAll('.dialog__actions .dialog__action-button');
      const surveyKey = 'hidden-helfi-surveys';
      const storageManager = new LocalStorageManager('helfi-settings');
      let surveysToHide = null;
      let surveyFocusTrap = null;

      const siteimproveCrawler = ClientHelpers.isCookieSet('helfi_no_survey');

      try {
        // @todo Use the storageManager instead.
        surveysToHide = JSON.parse(window.localStorage.getItem('helfi-settings'));
      } catch (e) {
        console.error('Error parsing local storage data:', e);
      }

      function addToSurveyStorage() {
        const { uuid } = survey.dataset;
        if (uuid) {
          storageManager.addValue(surveyKey, uuid);
        }
      }

      function addFocusTrap() {
        surveyFocusTrap = window.focusTrap.createFocusTrap('#helfi-survey', {
          initialFocus: () => '#helfi-survey__title'
        });
        surveyFocusTrap.activate();
      }

      function toggleNoScroll(enable) {
        root.classList.toggle('noscroll', enable);
      }

      function setBodyPaddingRight(enable) {
        if (enable) {
          document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        } else {
          document.body.style.removeProperty('padding-right');
        }
      }

      function focusToCookieBanner() {
        // Check if the cookie banner exists and focus the appropriate button
        const cookieBanner = document.querySelector('.hds-cc__target');
        const shadowRoot = cookieBanner?.shadowRoot;
        const cookieButton = shadowRoot?.querySelector('.hds-cc__all-cookies-button');

        if (cookieBanner && cookieButton) {
          cookieButton.focus();
        }
      }

      function toggleOtherContentVisibility() {
        const mainContent = document.querySelector('.dialog-off-canvas-main-canvas');
        const cookieBanner = document.querySelector('.hds-cc__target');
        const skipToMain = document.querySelector('.skip-link--skip-to-main');
        const surveyContainer = document.getElementById('helfi-survey__container');

        if (mainContent && !mainContent.hasAttribute('inert') && surveyContainer) {
          mainContent.setAttribute('inert', '');
        } else {
          // eslint-disable-next-line no-unused-expressions
          mainContent && mainContent.removeAttribute('inert');
        }

        if (skipToMain && !skipToMain.hasAttribute('inert') && surveyContainer) {
          skipToMain.setAttribute('inert', '');
        } else {
          // eslint-disable-next-line no-unused-expressions
          skipToMain && skipToMain.removeAttribute('inert');
        }

        if (cookieBanner && !cookieBanner.hasAttribute('inert') && surveyContainer) {
          cookieBanner.setAttribute('inert', '');
        } else {
          // eslint-disable-next-line no-unused-expressions
          cookieBanner && cookieBanner.removeAttribute('inert');
        }
      }

      function showSurvey() {
        const { uuid } = survey.dataset;
        const hiddenSurveys = surveysToHide?.[surveyKey] || [];
        const shouldShowSurvey = !uuid || !hiddenSurveys.includes(uuid);

        if (shouldShowSurvey) {
          survey.style.display = 'flex';
          setBodyPaddingRight(true);
          toggleNoScroll(true);
          addFocusTrap();
          toggleOtherContentVisibility();
        } else {
          survey.remove();
          toggleOtherContentVisibility();
          focusToCookieBanner();
        }
      }


      // Function to hide the survey and remove noscroll from body.
      function removeSurvey() {
        addToSurveyStorage();
        surveyFocusTrap.deactivate();
        survey.remove();
        toggleNoScroll(false);
        setBodyPaddingRight(false);
        toggleOtherContentVisibility();
        focusToCookieBanner();
      }

      if (surveyButtons) {
        surveyButtons.forEach(
          button => button.addEventListener('click', removeSurvey)
        );
      }

      function handleEscapeKey(event) {
        if (event.key === 'Escape') {
          removeSurvey();
        }
      }

      document.body.addEventListener('keydown', handleEscapeKey);

      // Make sure that its not Siteimprove Crawler viewing the site.
      if (!siteimproveCrawler) {
        // Set a timeout to show the survey after the defined delay.
        setTimeout(showSurvey, surveyDelay);
      }

    }
  };
})(Drupal);

import LocalStorageManager from './localStorageManager';

// eslint-disable-next-line func-names
(function (Drupal) {
  Drupal.behaviors.closable_surveys = {
    attach: function attach() {
      const survey = document.getElementById('survey__container');
      if (!survey) return;

      const root = document.documentElement;
      const surveyDelay = 2000;
      const surveyCloseButton = document.getElementById('survey__close-button');
      const surveyKey = 'hidden-helfi-surveys';
      const storageManager = new LocalStorageManager('helfi-settings');
      let surveysToHide = null;
      try {
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

      function showSurvey() {
        const scrollBarWidth = `${window.innerWidth - document.documentElement.clientWidth}px`;
        const { uuid } = survey.dataset;
        const hiddenSurveys = surveysToHide?.[surveyKey] || [];
        const shouldShowSurvey = !uuid || !hiddenSurveys.includes(uuid);

        if (shouldShowSurvey) {
          survey.style.display = 'flex';
          root.classList.toggle('noscroll');
          document.body.classList.toggle('noscroll');
          document.body.style.paddingRight = scrollBarWidth;
        } else {
          survey.remove();
        }
      }

      // Function to hide the survey and remove noscroll from body.
      function removeSurvey() {
        addToSurveyStorage();
        survey.remove();
        root.classList.toggle('noscroll');
        document.body.classList.toggle('noscroll');
        document.body.style.removeProperty('padding-right');
      }

      if (surveyCloseButton) {
        surveyCloseButton.addEventListener('click', removeSurvey);
      }

      document.body.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          removeSurvey();
        }
      });

      // Set a timeout to show the survey after the defined delay.
      setTimeout(showSurvey, surveyDelay);
    }
  };
})(Drupal);
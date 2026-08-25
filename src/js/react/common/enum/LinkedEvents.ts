const LinkedEvents = {
  PLACES_URL: 'https://api.hel.fi/linkedevents/v1/place/',
  KEYWORDS_URL: 'https://api.hel.fi/linkedevents/v1/keyword/',
  MAIN_CATEGORY_URLS: {
    General: 'https://api.hel.fi/linkedevents/v1/keyword_set/helsinki:topics/?include=keywords',
    Course: 'https://api.hel.fi/linkedevents/v1/keyword_set/helsinki:courses/?include=keywords',
  },
};

export default LinkedEvents;

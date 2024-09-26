export const useLanguageQuery = () => ({
  bool: {
    filter: [
      { term: { _language: window.drupalSettings.path.currentLanguage || 'fi' } },
    ],
  },
});

export default useLanguageQuery;

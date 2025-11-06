export const useLanguageQuery = () => ({
  bool: {
    filter: [{ term: { search_api_language: window.drupalSettings.path.currentLanguage || 'fi' } }],
  },
});

export default useLanguageQuery;

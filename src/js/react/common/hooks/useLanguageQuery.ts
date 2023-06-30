export const useLanguageQuery = () => {
  return {
    bool: {
      filter: [{ term: { _language: window.drupalSettings.path.currentLanguage || 'fi' } }],
    },
  };
};

export default useLanguageQuery;

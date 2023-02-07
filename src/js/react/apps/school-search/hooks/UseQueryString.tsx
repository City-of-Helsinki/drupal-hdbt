import GlobalSettings from '../enum/GlobalSettings';

const useQueryString = () => {
  const { size } = GlobalSettings;

  const query = {
    bool: {
      filter: [
        {
          term: {
            _language: drupalSettings.path.currentLanguage
          }
        }
      ],
    }
  };

  return JSON.stringify({
    query,
    size,
    sort: [
      {
        'name.keyword': 'asc'
      }
    ]
  });
};

export default useQueryString;

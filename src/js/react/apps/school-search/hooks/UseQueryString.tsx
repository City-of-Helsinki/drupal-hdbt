import GlobalSettings from '../enum/GlobalSettings';

const UseQueryString = () => {
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

export default UseQueryString;

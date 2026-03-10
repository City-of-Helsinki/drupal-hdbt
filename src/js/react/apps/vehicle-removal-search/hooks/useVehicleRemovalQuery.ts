import { useAtomValue } from 'jotai';
import { submittedStateAtom } from '../store';
import Global from '../enum/Global';

const useVehicleRemovalQuery = (): string => {
  const { streets, page } = useAtomValue(submittedStateAtom);

  const query: Record<string, unknown> = {
    size: Global.size,
    from: (page - 1) * Global.size,
  };

  const innerQuery = streets.length
    ? {
        bool: {
          must: [
            {
              terms: {
                street_names: streets.map((street) => street.value),
              },
            },
          ],
        },
      }
    : { match_all: {} };

  query.query = {
    function_score: {
      query: innerQuery,
      functions: [
        {
          linear: {
            valid_from: {
              origin: 'now',
              scale: '7d',
              decay: 0.5,
            },
          },
        },
      ],
      boost_mode: 'replace',
    },
  };

  return JSON.stringify(query);
};

export default useVehicleRemovalQuery;

import { useAtomValue } from 'jotai';
import Global from '../enum/Global';
import { submittedStateAtom } from '../store';

const useVehicleRemovalQuery = (override: { size?: number; from?: number } = {}): string => {
  const { streets, page } = useAtomValue(submittedStateAtom);

  const query: Record<string, unknown> = {
    size: override.size ?? Global.size,
    from: override.from ?? (page - 1) * Global.size,
  };

  const innerQuery = streets.length
    ? {
        bool: {
          must: [
            {
              terms: {
                street_names: streets.flatMap((street) => street.value),
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

import { useAtomValue } from 'jotai';
import { submittedStateAtom } from '../store';
import Global from '../enum/Global';

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
                street_names: streets.map((street) => street.value),
              },
            },
          ],
        },
      }
    : { match_all: {} };

  // Round to the nearest 10 minutes (in unix seconds) to keep the SWR
  // query key stable and avoid infinite re-fetches.
  const nowSeconds = Math.floor(Date.now() / 1000 / 600) * 600;

  query.query = {
    function_score: {
      query: innerQuery,
      functions: [
        {
          linear: {
            valid_from: {
              origin: nowSeconds,
              scale: 604800, // 7 days in seconds
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

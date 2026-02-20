import { useAtomValue } from 'jotai';
import { submittedStateAtom } from '../store';
import Global from '../enum/Global';

const useVehicleRemovalQuery = (): string => {
  const { streets, page } = useAtomValue(submittedStateAtom);

  const query: Record<string, unknown> = {
    size: Global.size,
    from: (page - 1) * Global.size,
  };

  if (streets.length) {
    query.query = {
      bool: {
        must: [
          {
            terms: {
              street_names: streets.map((street) => street.value),
            },
          },
        ],
      },
    };
  } else {
    query.query = { match_all: {} };
  }

  return JSON.stringify(query);
};

export default useVehicleRemovalQuery;

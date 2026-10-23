import { useAtomValue } from 'jotai';
import Global from '../enum/Global';
import { submittedStateAtom } from '../store';

const useVehicleRemovalQuery = (override: { size?: number; from?: number } = {}): string => {
  const { streets, postalCodes, parkingZones, page } = useAtomValue(submittedStateAtom);

  const query: Record<string, unknown> = {
    size: override.size ?? Global.size,
    from: override.from ?? (page - 1) * Global.size,
  };

  // Values within a filter are OR'ed, separate filters are AND'ed.
  const must: Record<string, unknown>[] = [];

  if (streets.length) {
    must.push({ terms: { street_names: streets.flatMap((street) => street.value) } });
  }

  if (postalCodes.length) {
    must.push({ terms: { postal_codes: postalCodes.flatMap((postalCode) => postalCode.value) } });
  }

  if (parkingZones.length) {
    must.push({ terms: { parking_zone_names: parkingZones.flatMap((parkingZone) => parkingZone.value) } });
  }

  const innerQuery = must.length ? { bool: { must } } : { match_all: {} };

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

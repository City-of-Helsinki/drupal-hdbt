import { useAtomValue } from 'jotai';

import CustomIds from '../enum/CustomTermIds';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { nodeFilter } from '../query/queries';
import URLParams from '../types/URLParams';
import { configurationsAtom } from '../store';
import { getAreaInfo } from '../helpers/Areas';

const useQueryString = (urlParams: URLParams): string => {
  const { size: globalSize, sortOptions } = Global;
  const { promoted } = useAtomValue(configurationsAtom);
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const must: any[] = [{
    // Legacy sanity check, make sure forced translations aren't included
    bool: {
      must_not: {
        term: {
          [IndexFields.PROMOTED]: true
        }
      }
    }
  }];
  const should = [];

  if (urlParams.keyword && urlParams.keyword.length > 0) {
    must.push({
      bool: {
        should: [
          {
            match_phrase_prefix: {
              [IndexFields.RECRUITMENT_ID]: urlParams.keyword.toString(),
            },
          },
          {
            combined_fields: {
              query: urlParams.keyword.toString().toLowerCase(),
              fields: [
                `${IndexFields.TITLE}^2`,
                `${IndexFields.ORGANIZATION}^1.5`,
                IndexFields.ORGANIZATION_NAME,
                IndexFields.EMPLOYMENT,
              ],
            },
          },
          {
            wildcard: {
              [IndexFields.TITLE]: `*${urlParams.keyword.toString().toLowerCase()}*`,
            },
          },
        ],
      },
    });
  }

  if (urlParams?.task_areas?.length) {
    must.push({
      terms: {
        [IndexFields.TASK_AREA_EXTERNAL_ID]: urlParams.task_areas,
      },
    });
  }

  // These values can match either employment or employment_type IDs
  if (urlParams?.employment?.length) {
    must.push({
      bool: {
        should: [
          {
            terms: {
              [IndexFields.EMPLOYMENT_ID]: urlParams.employment,
            },
          },
          {
            terms: {
              [IndexFields.EMPLOYMENT_TYPE_ID]: urlParams.employment,
            },
          },
        ],
        minimum_should_match: 1,
      },
    });
  }

  if (urlParams.continuous) {
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.CONTINUOUS,
      },
    });
  }

  if (urlParams.internship) {
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.TRAINING,
      },
    });
  }

  if (urlParams.summer_jobs) {
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.SUMMER_JOBS,
      },
    });
  }

  if (urlParams.youth_summer_jobs) {
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.YOUTH_SUMMER_JOBS,
      },
    });
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.COOL_SUMMER_PROJECT,
      },
    });
  }

  const query: any = {
    bool: {
      filter: [
        nodeFilter,
      ],
    }
  };

  if (urlParams.language) {
    query.bool.filter.push({
      term: {
        [IndexFields.LANGUAGE]: urlParams.language.toString(),
      },
    });
  }

  if (urlParams?.area_filter?.length) {
    const postalCodes: string[] = [];
    urlParams.area_filter.forEach(areaCode => {
      postalCodes.push(...getAreaInfo.find(area => area.key === areaCode)?.postalCodes || []);
    });

    query.bool.filter.push({
      terms: {
        [IndexFields.POSTAL_CODE]: postalCodes
      }
    });
  }

  if (Object.keys(must).length) {
    query.bool.must = must;
  }

  if (should.length) {
    query.bool.should = should;
    query.bool.minimum_should_match = 1;
  }

  const closing = {
    [IndexFields.UNPUBLISH_ON]: {
      order: 'asc',
    },
  };
  const newest = {
    [IndexFields.PUBLICATION_STARTS]: {
      order: 'desc',
    },
  };

  const getSort = () => {
    if (urlParams?.sort === sortOptions.closing) {
      return closing;
    }
    if (urlParams?.sort === sortOptions.newestFirst) {
      return newest;
    }

    // Sort by newest by default
    return newest;
  };

  const sort = getSort();

  const getSizeFrom = () => {
    if (!promoted.length) {
      return [globalSize, globalSize * (page - 1)];
    }

    const promotedOnPage = (globalSize * (page - 1)) < promoted.length;
    const pastResults = globalSize * (page - 1);
    const promotedToShow = promotedOnPage && promoted.length - pastResults;
    const leftovers = promoted.length % globalSize;

    // Promoted take up the whole, no need to retrieve anything.
    if (Number(promotedToShow) >= globalSize) {
      return [0, 0];
    }

    // Retrieve results past promoted
    if (!promotedToShow) {
      const promotedPages = Math.ceil(promoted.length / globalSize);
      const normalPages = page - 1 - promotedPages;
;
      return [globalSize, globalSize * normalPages + (globalSize - leftovers)];
    }

    return [globalSize - leftovers, 0];
  };

  const [size, from] = getSizeFrom();

  return JSON.stringify({
    aggs: {
      [IndexFields.NUMBER_OF_JOBS]: {
        sum: {
          field: IndexFields.NUMBER_OF_JOBS,
          missing: 1,
        },
      },
      // Use cardinality agg to calculate total (collapsing affects the total)
      total_count: {
        cardinality: {
          field: `${IndexFields.RECRUITMENT_ID}.keyword`
        }
      }
    },
    // Use collapse to group translations
    collapse: {
      field: `${IndexFields.RECRUITMENT_ID}.keyword`,
      inner_hits: {
        name: 'translations',
        size: 3,
      }
    },
    from,
    query,
    sort: [sort, '_score'],
    size,
  });
};

export default useQueryString;

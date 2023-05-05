import CustomIds from '../enum/CustomTermIds';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { languageFilter, nodeFilter } from '../query/queries';
import URLParams from '../types/URLParams';

const useQueryString = (urlParams: URLParams): string => {
  const { size, sortOptions } = Global;
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const must = [];
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
              query: urlParams.keyword.toString(),
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
              [`${IndexFields.TITLE}`]: `*${urlParams.keyword.toString()}*`,
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
        urlParams.language
          ? {
              term: {
                [IndexFields.LANGUAGE]: urlParams.language.toString(),
              },
            }
          : languageFilter,
        nodeFilter,
      ],
    },
  };

  if (urlParams.language) {
    must.push({
      bool: {
        must: [
          {
            term: {
              [IndexFields.COPIED]: false,
            },
          },
        ],
      },
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

  const sort = urlParams?.sort === sortOptions.newestFirst ? newest : closing;

  return JSON.stringify({
    aggs: {
      [IndexFields.NUMBER_OF_JOBS]: {
        sum: {
          field: IndexFields.NUMBER_OF_JOBS,
          missing: 1,
        },
      },
    },
    sort: [sort],
    size,
    from: size * (page - 1),
    query,
  });
};

export default useQueryString;

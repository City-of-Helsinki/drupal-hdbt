import { useAtomValue } from 'jotai';

import CustomIds from '../enum/CustomTermIds';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { getAreaInfo } from '../helpers/Areas';
import { nodeFilter } from '../query/queries';
import { configurationsAtom, submittedStateAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';
import { OptionType } from '../types/OptionType';

const getArrayValues = (optionArray: OptionType[]): string[] => {
  const result: string[] = [];

  optionArray.forEach((option) => {
    if (Array.isArray(option.value)) {
      result.push(...option.value);
    } else {
      result.push(option.value.toString());
    }
  });

  return result;
};

const useQueryString = (): string => {
  const state = useAtomValue(submittedStateAtom);
  const { size: globalSize, sortOptions } = Global;
  const { promoted } = useAtomValue(configurationsAtom) || {};
  const page = Number.isNaN(Number(state[SearchComponents.PAGE]))
    ? 1
    : Number(state[SearchComponents.PAGE]);
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  const must: any[] = [
    {
      // Legacy sanity check, make sure forced translations aren't included
      bool: { must_not: { term: { [IndexFields.PROMOTED]: true } } },
    },
  ];
  const should = [];

  if (
    state[SearchComponents.KEYWORD] &&
    state[SearchComponents.KEYWORD].toString().length > 0
  ) {
    must.push({
      bool: {
        should: [
          {
            match_phrase_prefix: {
              [IndexFields.RECRUITMENT_ID]:
                state[SearchComponents.KEYWORD].toString(),
            },
          },
          {
            combined_fields: {
              query: state[SearchComponents.KEYWORD].toString().toLowerCase(),
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
              [`${IndexFields.TITLE}.keyword`]: `*${state[SearchComponents.KEYWORD].toString().toLowerCase()}*`,
            },
          },
          {
            wildcard: {
              [IndexFields.TITLE]: `*${state[SearchComponents.KEYWORD].toString().toLowerCase()}*`,
            },
          },
        ],
      },
    });
  }

  if ((state[SearchComponents.TASK_AREAS] as OptionType[])?.length) {
    must.push({
      terms: {
        [IndexFields.TASK_AREA_EXTERNAL_ID]: getArrayValues(
          state[SearchComponents.TASK_AREAS] as OptionType[],
        ),
      },
    });
  }

  // These values can match either employment or employment_type IDs
  if ((state[SearchComponents.EMPLOYMENT] as OptionType[])?.length) {
    must.push({
      bool: {
        should: [
          {
            terms: {
              [IndexFields.EMPLOYMENT_ID]: getArrayValues(
                state[SearchComponents.EMPLOYMENT] as OptionType[],
              ),
            },
          },
          {
            terms: {
              [IndexFields.EMPLOYMENT_TYPE_ID]: getArrayValues(
                state[SearchComponents.EMPLOYMENT] as OptionType[],
              ),
            },
          },
        ],
        minimum_should_match: 1,
      },
    });
  }

  if (state[SearchComponents.CONTINUOUS]) {
    should.push({
      term: { [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.CONTINUOUS },
    });
  }

  if (state[SearchComponents.INTERNSHIPS]) {
    should.push({
      term: { [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.TRAINING },
    });
  }

  if (state[SearchComponents.SUMMER_JOBS]) {
    should.push({
      term: { [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.SUMMER_JOBS },
    });
  }

  if (state[SearchComponents.YOUTH_SUMMER_JOBS]) {
    should.push({
      term: { [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.YOUTH_SUMMER_JOBS },
    });
    should.push({
      term: {
        [IndexFields.EMPLOYMENT_SEARCH_ID]: CustomIds.COOL_SUMMER_PROJECT,
      },
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  const query: any = { bool: { filter: [nodeFilter] } };

  if ((state[SearchComponents.LANGUAGE] as OptionType[]).length) {
    query.bool.filter.push({
      term: {
        [IndexFields.LANGUAGE]: (
          state[SearchComponents.LANGUAGE] as OptionType[]
        )[0].value,
      },
    });
  }

  if ((state[SearchComponents.AREA_FILTER] as OptionType[])?.length) {
    const postalCodes: string[] = [];
    (state[SearchComponents.AREA_FILTER] as OptionType[]).forEach(
      (areaCode) => {
        postalCodes.push(
          ...(getAreaInfo.find((area) => area.key === areaCode.value)
            ?.postalCodes || []),
        );
      },
    );

    query.bool.filter.push({
      terms: { [IndexFields.POSTAL_CODE]: postalCodes },
    });
  }

  if (Object.keys(must).length) {
    query.bool.must = must;
  }

  if (should.length) {
    query.bool.should = should;
    query.bool.minimum_should_match = 1;
  }

  const closing = { [IndexFields.UNPUBLISH_ON]: { order: 'asc' } };
  const newest = { [IndexFields.PUBLICATION_STARTS]: { order: 'desc' } };

  const getSort = () => {
    if (state?.sort === sortOptions.closing) {
      return closing;
    }
    if (state?.sort === sortOptions.newestFirst) {
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

    const promotedOnPage = globalSize * (page - 1) < promoted.length;
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
      return [globalSize, globalSize * normalPages + (globalSize - leftovers)];
    }

    return [globalSize - leftovers, 0];
  };

  const [size, from] = getSizeFrom();

  return JSON.stringify({
    aggs: {
      [IndexFields.NUMBER_OF_JOBS]: {
        sum: { field: IndexFields.NUMBER_OF_JOBS, missing: 1 },
      },
      // Use cardinality agg to calculate total (collapsing affects the total)
      total_count: {
        cardinality: { field: `${IndexFields.RECRUITMENT_ID}.keyword` },
      },
    },
    // Use collapse to group translations
    collapse: {
      field: `${IndexFields.RECRUITMENT_ID}.keyword`,
      inner_hits: { name: 'translations', size: 3 },
    },
    from,
    query,
    sort: [sort, '_score'],
    size,
  });
};

export default useQueryString;

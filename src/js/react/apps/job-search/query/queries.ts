import CustomIds from '../enum/CustomTermIds';
import IndexFields from '../enum/IndexFields';

export const currentLanguage =
  window.drupalSettings.path.currentLanguage || 'fi';

// Filter by current language
const languageFilter = {
  term: { [`${IndexFields.LANGUAGE}`]: currentLanguage },
};

// Filter out taxonomy terms
export const nodeFilter = {
  term: { [IndexFields.ENTITY_TYPE]: 'node' },
};

// Alphabetical sort for terms
const alphabeticallySortTerms = {
  name: {
    order: 'asc',
  },
};

const termSubAgg = {
  unique: {
    cardinality: {
      field: `${IndexFields.RECRUITMENT_ID}.keyword`,
    },
  },
};

export const PROMOTED_IDS = {
  aggs: {
    promoted: {
      terms: {
        field: IndexFields.NID,
        size: 100,
      },
    },
  },
  query: {
    bool: {
      filter: [nodeFilter],
      must: [
        {
          term: {
            [IndexFields.PROMOTED]: true,
          },
        },
      ],
    },
  },
};

// Base aggregations
export const AGGREGATIONS = {
  aggs: {
    occupations: {
      terms: {
        field: 'task_area_external_id',
        size: 100,
      },
      aggs: termSubAgg,
    },
    employment: {
      terms: {
        field: 'employment_id',
        size: 100,
      },
      aggs: termSubAgg,
    },
    employment_type: {
      terms: {
        field: 'employment_type_id',
        size: 100,
      },
      aggs: termSubAgg,
    },
    employment_search_id: {
      terms: {
        field: 'employment_search_id',
        size: 100,
      },
      aggs: termSubAgg,
    },
  },
  query: {
    bool: {
      filter: [nodeFilter],
    },
  },
};

// Get all employment filter options
export const EMPLOYMENT_FILTER_OPTIONS = {
  query: {
    bool: {
      should: [
        { term: { field_search_id: CustomIds.FIXED_CONTRACTUAL } },
        { term: { field_search_id: CustomIds.FIXED_SERVICE } },
        { term: { field_search_id: CustomIds.PERMANENT_CONTRACTUAL } },
        { term: { field_search_id: CustomIds.PERMANENT_SERVICE } },
        { term: { field_search_id: CustomIds.TRAINING } },
        { term: { field_search_id: CustomIds.ALTERNATION } },
      ],
      minimum_should_match: 1,
      filter: [
        languageFilter,
        { term: { [IndexFields.ENTITY_TYPE]: 'taxonomy_term' } },
      ],
    },
  },
  sort: [alphabeticallySortTerms],
  size: 100,
};

// Get all eligible language options
export const LANGUAGE_OPTIONS = {
  aggs: {
    languages: {
      terms: {
        field: '_language',
      },
    },
  },
  query: {
    bool: {
      filter: [nodeFilter],
    },
  },
};

// Get all task area options
export const TASK_AREA_OPTIONS = {
  query: {
    bool: {
      filter: [
        {
          term: {
            vid: 'task_area',
          },
        },
        {
          term: {
            entity_type: 'taxonomy_term',
          },
        },
        languageFilter,
      ],
    },
  },
  sort: [alphabeticallySortTerms],
  size: 100,
};

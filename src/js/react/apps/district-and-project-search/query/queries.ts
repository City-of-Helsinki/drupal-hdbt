import IndexFields from '../enum/IndexFields';

// Filter by current language
// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
export const languageFilter: any = {
  term: { [`${IndexFields.LANGUAGE}`]: window.drupalSettings.path.currentLanguage || 'fi' },
};

// Filter out taxonomy terms
// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
export const nodeFilter: any = {
  terms: { [IndexFields.CONTENT_TYPE]: ['project', 'district'] },
};

// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
export const sortOptions: any = {
  most_relevant: {
    _score: { order: 'desc' },
    [`${IndexFields.TITLE}`]: { order: 'asc' },
  },
  asc: {
    [`${IndexFields.TITLE}`]: { order: 'asc' },
  },
  desc: {
    [`${IndexFields.TITLE}`]: { order: 'desc' },
  },
};

// Base aggregations
export const AGGREGATIONS = {
  aggs: {
    // district and district title for UI
    [IndexFields.FIELD_PROJECT_DISTRICT_TITLE]: {
      terms: {
        field: `${IndexFields.FIELD_PROJECT_DISTRICT_TITLE_FOR_UI}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    [IndexFields.TITLE]: {
      terms: {
        field: `${IndexFields.TITLE_FOR_UI}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    [IndexFields.FIELD_DISTRICT_SUBDISTRICTS_TITLE]: {
      terms: {
        field: `${IndexFields.FIELD_DISTRICT_SUBDISTRICTS_TITLE_FOR_UI}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    districts_for_filters: {
      terms: {
        field: `${IndexFields.DISTRICTS_FOR_FILTERS_DISTRICT_TITLE}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    // project theme
    [IndexFields.FIELD_PROJECT_THEME_NAME]: {
      terms: {
        field: `${IndexFields.FIELD_PROJECT_THEME_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    project_theme_taxonomy_terms: {
      terms: {
        field: `${IndexFields.PROJECT_THEME_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    // project phase
    [IndexFields.FIELD_PROJECT_PHASE_NAME]: {
      terms: {
        field: `${IndexFields.FIELD_PROJECT_PHASE_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    project_phase_taxonomy_terms: {
      terms: {
        field: `${IndexFields.PROJECT_PHASE_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    // project type
    [IndexFields.FIELD_PROJECT_TYPE_NAME]: {
      terms: {
        field: `${IndexFields.FIELD_PROJECT_TYPE_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
    project_type_taxonomy_terms: {
      terms: {
        field: `${IndexFields.PROJECT_TYPE_NAME}`,
        size: 500,
        order: { _key: 'asc' },
      },
    },
  },
  query: {
    bool: {
      filter: [languageFilter],
    },
  },
};

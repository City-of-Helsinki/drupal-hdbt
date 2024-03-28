import BooleanQuery from '@/types/BooleanQuery';
import AppSettings from '../enum/AppSettings';
import IndexFields from '../enum/IndexFields';
import SearchParams from '../types/SearchParams';

// Filter by current language
export const languageFilter: any = {
  term: { [`${IndexFields.LANGUAGE}`]: window.drupalSettings.path.currentLanguage || 'fi' },
};

const getCheckBoxFilters = (params: SearchParams) => {
  const languageKeys = ['finnish_education', 'swedish_education'];
  const gradeKeys = ['grades_1_6', 'grades_1_9', 'grades_7_9'];
  const query: any = [];

  [languageKeys, gradeKeys].forEach((keys) => {
    const hits: string[] = [];

    keys.forEach((key: string) => {
      if (params[key as keyof SearchParams]) {
        hits.push(key);
      }
    });

    if (hits.length) {
      query.push({
        bool: {
          minimum_should_match: 1,
          should: hits.map((hit) => ({
            term: {
              [`additional_filters.${hit}`]: true
            }
          }))
        }
      });
    }
  });

  return query;
};

const getDropdownFilters = (filterValues: any, indexField: string) => {
  const filters: any = [{
    bool: {
      minimum_should_match: 1,
      should: [],
    }
  }];

  filterValues.forEach((ontologywordId: string) => {
    filters[0].bool.should.push({ term: { [indexField]: ontologywordId }});
  });

  return filters;
};

// Base aggregations
export const AGGREGATIONS = {
  aggs: {
    ontologywordIds: {
      terms: {
        field: 'ontologyword_ids.keyword',
        size: 100,
      },
    },
    ontologywordClarifications: {
      terms: {
        field: 'ontologyword_details_clarifications.keyword',
        size: 100,
      },
    },
  },
  query: {
    bool: {
      filter: [languageFilter],
    },
  },
};

const getQueryString = (params: SearchParams, page: number) => {
  const { size } = AppSettings;
  const { keyword, a1, a2, b1, b2, weighted_education, bilingual_education } = params;

  const query: BooleanQuery = {
    bool: {
      filter: [
        {
          term: {
            _language: drupalSettings.path.currentLanguage
          }
        }
      ],
      must: [],
    }
  };

  if (keyword && keyword.length) {
    query.bool.should = [
      {
        match_phrase_prefix: {
          name: {
            query: keyword,
            boost: 1.5
          },
        }
      },
      {
        match: {
          name: {
            query: keyword
          }
        }
      },
      {
        wildcard: {
          name: {
            value: `*${keyword}*`
          }
        }
      },
      {
        term: {
          'postal_code': keyword
        }
      }
    ];

    query.bool.minimum_should_match = 1;
  }

  const checkBoxFilters: any = getCheckBoxFilters(params);
  if (checkBoxFilters.length) {
      query.bool.must = [{
        nested: {
        path: 'additional_filters',
        query: {
          bool: {
            must: checkBoxFilters
          }
        }
      }
    }];
  };

  if (a1 && a1.length) {
    const dropdownFilters: any = getDropdownFilters(a1, 'ontologyword_ids');
    query.bool.must?.push(...dropdownFilters);
  }

  if (a2 && a2.length) {
    const dropdownFilters: any = getDropdownFilters(a2, 'ontologyword_ids');
    query.bool.must?.push(...dropdownFilters);
  }

  if (b1 && b1.length) {
    const dropdownFilters: any = getDropdownFilters(b1, 'ontologyword_ids');
    query.bool.must?.push(...dropdownFilters);
  }

  if (b2 && b2.length) {
    const dropdownFilters: any = getDropdownFilters(b2, 'ontologyword_ids');
    query.bool.must?.push(...dropdownFilters);
  }

  if (weighted_education && weighted_education.length) {
    const dropdownFilters: any = getDropdownFilters(weighted_education, 'ontologyword_details_clarifications');
    query.bool.must?.push(...dropdownFilters);
  }

  if (bilingual_education && bilingual_education.length) {
    const dropdownFilters: any = getDropdownFilters(bilingual_education, 'ontologyword_ids');
    query.bool.must?.push(...dropdownFilters);
  }

  const sort: any[] = [
    {
      'name.keyword': 'asc'
    }
  ];

  if (keyword?.length) {
    sort.unshift({
      _score: 'desc'
    });
  }

  return JSON.stringify({
    aggs: {
      ids: {
        terms: {
          field: 'id.keyword',
          size: 1000
        },
      },
    },
    from: size * (page - 1),
    query,
    size,
    sort,
  });
};

export default getQueryString;

import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import { ComponentMap } from '../helpers/helpers';
import { languageFilter, nodeFilter, sortOptions } from '../query/queries';
import type BooleanQuery from '../types/BooleanQuery';
import type URLParams from '../types/URLParams';

const useQueryString = (urlParams: URLParams): string => {
  const { size } = Global;
  const page = Number.isNaN(Number(urlParams.page))
    ? 1
    : Number(urlParams.page);
  const weight: number = 2;

  const query: BooleanQuery = {
    function_score: {
      query: {
        bool: {
          should: [
            {
              bool: {
                _name: 'Match district',
                should: [],
                filter: {
                  term: {
                    _index: 'districts',
                  },
                },
              },
            },
            {
              bool: {
                _name: 'Match Project',
                should: [],
                must: [],
                filter: {
                  term: {
                    _index: 'projects',
                  },
                },
              },
            },
          ],
          filter: [languageFilter, nodeFilter],
        },
      },
      functions: [
        {
          filter: { term: { content_type: 'district' } },
          weight,
        },
      ],
      score_mode: 'sum',
      boost_mode: 'max', // max of query score and function score
      min_score: 0,
    },
  };

  if (
    Object.keys(urlParams).find(
      (param) =>
        Object.keys(ComponentMap).includes(param) &&
        urlParams?.[param as keyof URLParams]?.length,
    )
  ) {
    const isProjectFilterSet = Object.keys(ComponentMap)
      .filter(
        (item: string) =>
          item !== 'title' &&
          item !== 'districts' &&
          item !== 'page' &&
          item !== 'sort',
      )
      .find((key: string) => urlParams?.[key as keyof URLParams]?.length);
    const isDistrictFilterSet = urlParams?.districts?.length;
    const isTitleFilterSet = urlParams?.title?.length;

    query.function_score.min_score =
      (isProjectFilterSet && isDistrictFilterSet) ||
      (isProjectFilterSet && isTitleFilterSet)
        ? Number(300)
        : Number(weight + 1);

    if (urlParams?.title?.length) {
      const title = urlParams.title.toString().toLowerCase();
      const districtWildcards: object[] = [];
      const projectWildcards: object[] = [];

      districtWildcards.push({
        wildcard: { [IndexFields.TITLE]: { value: `*${title}*`, boost: 300 } },
      });
      districtWildcards.push({
        wildcard: {
          [IndexFields.FIELD_DISTRICT_SUBDISTRICTS_TITLE]: {
            value: `*${title}*`,
            boost: 200,
          },
        },
      });
      districtWildcards.push({
        wildcard: {
          [IndexFields.FIELD_DISTRICT_SEARCH_METATAGS]: {
            value: `*${title}*`,
            boost: 150,
          },
        },
      });

      projectWildcards.push({
        wildcard: {
          [`${IndexFields.TITLE}`]: { value: `*${title}*`, boost: 150 },
        },
      });
      // if project filter is also set, boost projects.
      projectWildcards.push({
        wildcard: {
          [IndexFields.FIELD_PROJECT_DISTRICT_TITLE]: {
            value: `*${title}*`,
            boost: isProjectFilterSet ? 3000 : 150,
          },
        },
      });
      projectWildcards.push({
        wildcard: {
          [IndexFields.FIELD_PROJECT_SEARCH_METATAGS]: {
            value: `*${title}*`,
            boost: 150,
          },
        },
      });

      query.function_score.query.bool.should[0].bool.should.push(
        ...districtWildcards,
      );
      query.function_score.query.bool.should[1].bool.should.push(
        ...projectWildcards,
      );
    }

    if (urlParams?.districts?.length) {
      const districtTerms: object[] = [];
      const projectTerms: object[] = [];
      const { districts } = urlParams;

      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      Object.keys(districts).forEach((key: any) => {
        districtTerms.push({
          term: {
            [IndexFields.TITLE]: {
              value: districts[key].toLowerCase(),
              boost: isProjectFilterSet ? 150 : 1000,
            },
          },
        });
        // if project filter is also set, don't boost districts with subdistricts.
        districtTerms.push({
          term: {
            [IndexFields.FIELD_DISTRICT_SUBDISTRICTS_TITLE]: {
              value: districts[key].toLowerCase(),
              boost: isProjectFilterSet ? 0 : 1000,
            },
          },
        });

        projectTerms.push({
          term: {
            [IndexFields.TITLE]: {
              value: districts[key].toLowerCase(),
              boost: isProjectFilterSet ? 3000 : 150,
            },
          },
        });
        // if project filter is also set, boost projects.
        projectTerms.push({
          term: {
            [IndexFields.FIELD_PROJECT_DISTRICT_TITLE]: {
              value: districts[key].toLowerCase(),
              boost: isProjectFilterSet ? 3000 : 150,
            },
          },
        });
      });

      query.function_score.query.bool.should[0].bool.should.push(
        ...districtTerms,
      );
      query.function_score.query.bool.should[1].bool.should.push(
        ...projectTerms,
      );
    }

    if (urlParams?.project_theme?.length) {
      const { project_theme } = urlParams;
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      Object.keys(project_theme).forEach((key: any) => {
        query.function_score.query.bool.should[1].bool.must?.push({
          term: {
            [IndexFields.FIELD_PROJECT_THEME_NAME]: {
              value: project_theme[key].toLowerCase(),
              boost: 10,
            },
          },
        });
      });
    }

    if (urlParams?.project_phase?.length) {
      const { project_phase } = urlParams;
      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      Object.keys(project_phase).forEach((key: any) => {
        query.function_score.query.bool.should[1].bool.must?.push({
          term: {
            [IndexFields.FIELD_PROJECT_PHASE_NAME]: {
              value: project_phase[key].toLowerCase(),
              boost: 10,
            },
          },
        });
      });
    }

    if (urlParams?.project_type?.length) {
      const { project_type } = urlParams;

      // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
      Object.keys(project_type).forEach((key: any) => {
        query.function_score.query.bool.should[1].bool.must?.push({
          term: {
            [IndexFields.FIELD_PROJECT_TYPE_NAME]: {
              value: project_type[key].toLowerCase(),
              boost: 10,
            },
          },
        });
      });
    }
  }

  const sort = urlParams?.sort?.length
    ? sortOptions[urlParams?.sort]
    : sortOptions.most_relevant;

  return JSON.stringify({
    sort: [sort],
    size,
    from: size * (page - 1),
    query,
  });
};

export default useQueryString;

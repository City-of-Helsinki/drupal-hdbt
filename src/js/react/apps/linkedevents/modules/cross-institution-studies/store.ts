import type { Option } from 'hds-react';
import { atom } from 'jotai';
import { LanguageOptions } from '../../enum/LanguageOptions';
import { TeachingModes } from '../enum/TeachingModes';
import type { DateTime } from 'luxon';
import ApiKeys from '../../enum/ApiKeys';
import { languageAtom, pageAtom, paramsAtom, submittedParamsAtom } from '../../store';

export const keywordAtom = atom<string>('');

export const teachingModeAtom = atom<Option[]>([]);

export const startDateAtom = atom<Option[]>([]);

export const visibleParams = [
  ApiKeys.COMBINED_TEXT,
  ApiKeys.END,
  ApiKeys.LANGUAGE,
  ApiKeys.START,
  ApiKeys.KEYWORDS,
  'page',
];

const optionDefaults: Option = {
  disabled: false,
  isGroupLabel: false,
  label: '',
  selected: false,
  value: '',
  visible: true,
};

export const initializeStateAtom = atom(
  null,
  (get, set, dateOptions: Map<string, { start?: DateTime; end?: DateTime }>) => {
    const params = new URLSearchParams(window.location.search);

    if (params.get(ApiKeys.COMBINED_TEXT)) {
      set(keywordAtom, params.get(ApiKeys.COMBINED_TEXT)?.trim() || '');
    }

    if (params.has(ApiKeys.END) && params.has(ApiKeys.START)) {
      const start = params.get(ApiKeys.START);
      const end = params.get(ApiKeys.END);

      if (start && end) {
        const matchingOption = Array.from(dateOptions.entries()).find(([_, { start: optionStart, end: optionEnd }]) => {
          return optionStart?.toISO() === start && optionEnd?.toISO() === end;
        });

        if (matchingOption) {
          set(startDateAtom, [{ ...optionDefaults, label: matchingOption[0], value: matchingOption[0] }]);
        }
      }
    }

    if (params.has(ApiKeys.LANGUAGE)) {
      const enabledLanguages = ['fi', 'en', 'sv'];
      const selectedLanguages =
        params
          .get(ApiKeys.LANGUAGE)
          ?.split(',')
          .filter((lang) => enabledLanguages.includes(lang))
          .map((lang) => ({
            ...optionDefaults,
            label: LanguageOptions[lang as keyof typeof LanguageOptions] || lang,
            selected: true,
            value: lang,
          })) || [];

      set(languageAtom, selectedLanguages);
    }

    if (params.has(ApiKeys.KEYWORDS)) {
      const allKeywords =
        params
          .get(ApiKeys.KEYWORDS)
          ?.split(',')
          .map((kw) => kw.trim()) || [];
      const teachingModeKeywords = allKeywords
        .filter((keyword) => TeachingModes.has(keyword))
        .map((keyword) => ({
          ...optionDefaults,
          label: TeachingModes.get(keyword) as string,
          selected: true,
          value: keyword,
        }));

      set(teachingModeAtom, teachingModeKeywords);
    }

    if (params.has('page')) {
      set(pageAtom, parseInt(params.get('page') || '1', 10));
    }

    for (const key of [...params.keys()]) {
      if (!visibleParams.includes(key)) {
        params.delete(key);
      }
    }

    const initialParams = get(paramsAtom);
    const mergedParams = new URLSearchParams(initialParams);

    for (const [key, value] of params.entries()) {
      mergedParams.set(key, value);
    }

    set(paramsAtom, mergedParams);
    set(submittedParamsAtom, mergedParams);
  },
);

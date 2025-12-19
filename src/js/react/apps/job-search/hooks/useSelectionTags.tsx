import type TagType from '@/types/TagType';
import type { OptionType } from '../types/OptionType';
import SearchComponents from '../enum/SearchComponents';
import { stripQuantityFromLabel } from '../helpers/Options';

export const useSelectionTags = (
  selections: [string, OptionType[] | boolean | string][],
): TagType[] => {
  const tags: TagType[] = [];

  selections.forEach(([key, value]) => {
    if (Array.isArray(value) && value.length) {
      value.forEach((option) => {
        tags.push({
          tag: [
            SearchComponents.EMPLOYMENT,
            SearchComponents.LANGUAGE,
            SearchComponents.TASK_AREAS,
          ].includes(key)
            ? stripQuantityFromLabel(option.label)
            : option.label,
          color: 'neutral',
        });
      });
    } else if (typeof value === 'boolean' && value === true) {
      tags.push({ tag: key.replace(/_/g, ' '), color: 'neutral' });
    } else {
      tags.push({ tag: value.toString(), color: 'neutral' });
    }
  });

  return tags;
};

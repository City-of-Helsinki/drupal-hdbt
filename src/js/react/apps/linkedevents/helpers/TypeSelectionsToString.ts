import { EventTypeOption } from '../types/EventTypeOption';

/**
 * Transform types selection to string.
 * 
 * @param {array} types - Types selection.
 * 
 * @return {string} - The result.
 */
export const typeSelectionsToString = (types: EventTypeOption[]): string => {
  if (!types.length) {
    return ['General', 'Course'].join(',');
  }

  return types.join(',');
};

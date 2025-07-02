import { atom } from 'jotai';
import ROOT_ID from './enum/RootId';

const createBaseAtom = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const paragraphId = rootElement?.dataset?.paragraphId;

  if (!rootElement || !paragraphId) {
    console.warn('Paragraph id not found in source HTML');
    return;
  }

  const settings = (drupalSettings as any).helfi_roadworks?.data?.[paragraphId];
  
  if (!settings) {
    return {};
  }

  const roadworksApiUrl = settings.roadworks_api_url || '';
  const fieldRoadworkCount = Number(settings.field_roadwork_count) || 3;
  const hidePagination = settings.hidePagination === true;

  return {
    rootElement,
    paragraphId,
    roadworksApiUrl,
    fieldRoadworkCount,
    hidePagination,
  };
};

// Store all needed data to 'master' atom
const baseAtom = atom(createBaseAtom());

// Export API URL atom directly (following linkedevents pattern)
export const roadworksApiUrlAtom = atom((get) => get(baseAtom)?.roadworksApiUrl || '');
export const fieldRoadworkCountAtom = atom((get) => get(baseAtom)?.fieldRoadworkCount || 3);
export const hidePaginationAtom = atom((get) => get(baseAtom)?.hidePagination || false);

export const settingsAtom = atom(
  (get) => {
    const base = get(baseAtom);
    return {
      roadworkCount: base?.fieldRoadworkCount || 3,
      hidePagination: base?.hidePagination === true,
    };
  }
);

// Client-side pagination atoms
export const currentPageAtom = atom<number>(1);
export const itemsPerPageAtom = atom<number>(10); // Default 10 roadworks per page

// Reset to first page when needed
export const resetPageAtom = atom(null, (get, set) => {
  set(currentPageAtom, 1);
});

export const addressAtom = atom('');

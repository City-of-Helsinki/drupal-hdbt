import { atom } from 'jotai';
import ROOT_ID from './enum/RootId';

const createBaseAtom = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const paragraphId = rootElement?.dataset?.paragraphId;

  if (!rootElement || !paragraphId) {
    console.warn('Paragraph id not found in source HTML');
    return;
  }

  const settings = (drupalSettings as any).helfi_roadworks?.[paragraphId];

  if (!settings) {
    return {};
  }

  const roadworksApiUrl = settings.roadworksApiUrl || '';
  const roadworkCount = Number(settings.roadworkCount) || 10;
  const hidePagination = settings.hidePagination ?? false;
  const cardsWithBorders = settings.cardsWithBorders ?? false;
  const scrollToTarget = settings.scrollToTarget ?? true;

  return {
    rootElement,
    paragraphId,
    roadworksApiUrl,
    roadworkCount,
    hidePagination,
    cardsWithBorders,
    scrollToTarget,
  };
};

// Store all needed data to 'master' atom
const baseAtom = atom(createBaseAtom());

// Export API URL atom directly (following linkedevents pattern)
export const roadworksApiUrlAtom = atom((get) => get(baseAtom)?.roadworksApiUrl);

export const settingsAtom = atom(
  (get) => {
    const base = get(baseAtom);
    return {
      roadworkCount: base?.roadworkCount,
      hidePagination: base?.hidePagination,
      cardsWithBorders: base?.cardsWithBorders,
      scrollToTarget: base?.scrollToTarget,
    };
  }
);

// Client-side pagination atoms
export const currentPageAtom = atom<number>(1);
export const itemsPerPageAtom = atom<number>(10); // Default 10 roadworks per page

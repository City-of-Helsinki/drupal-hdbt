import { atom } from 'jotai';
import ROOT_ID from './enum/RootId';

const createBaseAtom = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const paragraphId = rootElement?.dataset?.paragraphId;

  if (!rootElement || !paragraphId) {
    console.warn('Paragraph id not found in source HTML');
    return;
  }

  console.log('Creating base atom with:', { rootElement, paragraphId });

  const settings = (drupalSettings as any).helfi_roadworks?.data?.[paragraphId];
  console.log('Roadworks settings:', settings);

  if (!settings) {
    console.warn('No roadworks settings found in drupalSettings');
    return {};
  }

  const roadworksApiUrl = settings.roadworks_api_url || '';
  const fieldRoadworkCount = Number(settings.field_roadwork_count) || 3;
  const hidePagination = settings.hidePagination || false;

  console.log('Extracted data:', {
    roadworksApiUrl,
    fieldRoadworkCount,
    hidePagination,
  });

  return {
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

export const addressAtom = atom('');

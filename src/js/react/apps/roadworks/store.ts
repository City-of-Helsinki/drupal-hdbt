import { atom } from 'jotai';
import ROOT_ID from './enum/RootId';
import { RoadworksApi } from './enum/RoadworksApi';

const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
const paragraphId = rootElement?.dataset?.paragraphId;

if (!rootElement || !paragraphId) {
  throw new Error('Paragraph id not found in source HTML');
}

const settings = drupalSettings.helfi_roadworks?.[paragraphId];

const createBaseAtom = () => {
  if (!settings) {
    return {};
  }

  const roadworkCount = Number(settings.roadworkCount) || 10;
  const isShortList = settings.isShortList ?? false;
  const cardsWithBorders = settings.cardsWithBorders ?? false;
  const scrollToTarget = settings.scrollToTarget ?? true;

  return {
    rootElement,
    paragraphId,
    roadworkCount,
    isShortList,
    cardsWithBorders,
    scrollToTarget,
  };
};

// Store all needed data to 'master' atom
const baseAtom = atom(createBaseAtom());

export const settingsAtom = atom(
  (get) => {
    const base = get(baseAtom);
    return {
      roadworkCount: base?.roadworkCount,
      isShortList: base?.isShortList,
      cardsWithBorders: base?.cardsWithBorders,
      scrollToTarget: base?.scrollToTarget,
    };
  }
);


const urlParams = new URLSearchParams(window.location.search);

export const currentPageAtom = atom<number>(1);
export const itemsPerPageAtom = atom<number>(10);

const initializeKeyword = (): string => urlParams.get('q') || '';
export const keywordAtom = atom<string>(initializeKeyword());

const initializeCoordinates = (): [number, number, string]|null => {
  if (!settings.initialData?.lat || !settings.initialData?.lon) {
    return null;
  }

  return [Number(settings.initialData.lon), Number(settings.initialData.lat), settings.initialData.q || ''];
};
export const coordinatesAtom = atom<[number, number, string]|null>(initializeCoordinates());

const formApiUrl = (coordinates: [number, number, string]|null, address: string|null) => {
  const url = new URL(`${window.location.origin}/${drupalSettings.path.currentLanguage}/${RoadworksApi.API_URL}`);

  if (coordinates) {
    const [lon, lat] =  coordinates;
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
  }

  if (address) {
    url.searchParams.set('q', address);
  }

  return url.toString();
};
export const updateUrlAtom = atom(null, (_get, _set) => {
  const [currentCoordinates, currentKeyword] = [_get(coordinatesAtom), _get(keywordAtom)];

  _set(roadworksApiUrlAtom, formApiUrl(currentCoordinates, currentKeyword));
});

export const roadworksApiUrlAtom = atom<string>(formApiUrl(initializeCoordinates(), initializeKeyword()));

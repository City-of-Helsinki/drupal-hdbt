import { type Atom, useStore } from 'jotai';
import { useEffect, useEffectEvent } from 'react';

export const useAtomListener = <T>(anAtom: Atom<T>, listener: (value: T) => void) => {
  const store = useStore();
  const onChange = useEffectEvent(listener);

  useEffect(() => store.sub(anAtom, () => onChange(store.get(anAtom))), [store, anAtom]);
};

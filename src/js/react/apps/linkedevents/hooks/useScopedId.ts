import { useAtomValue } from 'jotai';
import { instanceIdAtom } from '../store';

/**
 * Scopes a component-local id to the embed it belongs to, so that several embeds on a page do
 * not emit the same element ids.
 */
export const useScopedId = (localId: string): string => {
  const instanceId = useAtomValue(instanceIdAtom);

  return instanceId ? `${localId}--${instanceId}` : localId;
};

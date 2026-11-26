import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type React from 'react';
import { Pagination as CommonPagination } from '@/react/common/Pagination';
import { pageAtom, settingsAtom, titleAtom, updatePageParamAtom } from '../store';

const getFallbackContext = (eventListType: string) => {
  switch (eventListType) {
    case 'hobbies':
      return Drupal.t('Hobbies', {}, { context: 'Pagination aria-label context' });
    case 'events_and_hobbies':
      return Drupal.t('Events and hobbies', {}, { context: 'Pagination aria-label context' });
    default:
      return Drupal.t('Events', {}, { context: 'Pagination aria-label context' });
  }
};

type PaginationProps = {
  onPageChange?: () => void;
  pages: number;
  totalPages: number;
};

export const Pagination = ({ onPageChange, pages, totalPages }: PaginationProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const updatePageParam = useSetAtom(updatePageParamAtom);
  // Event list title separates multiple event lists on the same page.
  // Lists without a title (e.g. Helsinki near you) fall back to the list type.
  const title = useAtomValue(titleAtom);
  const { eventListType } = useAtomValue(settingsAtom);

  if (!Number.isFinite(totalPages)) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setPage(index);
    updatePageParam(index);
    onPageChange?.();
  };

  return (
    <CommonPagination
      updatePage={updatePage}
      currentPage={page}
      pages={pages}
      totalPages={totalPages}
      ariaContext={title || getFallbackContext(eventListType)}
    />
  );
};

export default Pagination;

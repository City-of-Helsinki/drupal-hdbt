import { useAtom, useSetAtom } from 'jotai';
import type React from 'react';
import { type RefObject, useRef } from 'react';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import { Pagination as CommonPagination } from '@/react/common/Pagination';
import { pageAtom, updatePageParamAtom } from '../store';

type PaginationProps = {
  containerRef?: RefObject<HTMLElement | null>;
  isLoading?: boolean;
  pages: number;
  totalPages: number;
};

export const Pagination = ({ containerRef, isLoading = false, pages, totalPages }: PaginationProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const updatePageParam = useSetAtom(updatePageParamAtom);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const scrollToFirstItem = useScrollToFirstItem(containerRef ?? fallbackRef, isLoading);

  if (!Number.isFinite(totalPages)) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setPage(index);
    updatePageParam(index);
    scrollToFirstItem();
  };

  return <CommonPagination updatePage={updatePage} currentPage={page} pages={pages} totalPages={totalPages} />;
};

export default Pagination;

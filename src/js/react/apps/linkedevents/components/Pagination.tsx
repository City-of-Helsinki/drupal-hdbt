import { useAtom, useSetAtom } from 'jotai';
import type React from 'react';
import { Pagination as CommonPagination } from '@/react/common/Pagination';
import { pageAtom, updatePageParamAtom } from '../store';

type PaginationProps = {
  pages: number;
  totalPages: number;
};

export const Pagination = ({ pages, totalPages }: PaginationProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const updatePageParam = useSetAtom(updatePageParamAtom);

  if (!Number.isFinite(totalPages)) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setPage(index);
    updatePageParam(index);
  };

  return (
    <CommonPagination
      updatePage={updatePage}
      currentPage={page}
      pages={pages}
      totalPages={totalPages}
    />
  );
};

export default Pagination;

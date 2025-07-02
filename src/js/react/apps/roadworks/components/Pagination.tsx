import React from 'react';
import { useAtom } from 'jotai';

import { Pagination as CommonPagination } from '@/react/common/Pagination';
import { currentPageAtom } from '../store';

type PaginationProps = {
  totalPages: number;
  pages?: number;
};

export const Pagination = ({ totalPages, pages = 5 }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  if (!Number.isFinite(totalPages) || totalPages <= 1) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  return (
    <CommonPagination 
      updatePage={updatePage} 
      currentPage={currentPage} 
      pages={pages} 
      totalPages={totalPages} 
    />
  );
};

export default Pagination;

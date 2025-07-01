import React from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { Pagination as CommonPagination } from '@/react/common/Pagination';

type PaginationProps = {
  pages: number;
  totalPages: number;
};

export const Pagination = ({ pages, totalPages }: PaginationProps) => {
  // For now, we'll use simple state management
  // TODO: Add proper atom-based page management similar to events
  const [currentPage, setCurrentPage] = React.useState(1);

  if (!Number.isFinite(totalPages)) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setCurrentPage(index);
    // TODO: Add URL parameter update logic
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

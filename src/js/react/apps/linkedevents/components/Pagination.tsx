import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Pagination as CommonPagination } from '@/react/common/Pagination';
import { pageAtom, queryBuilderAtom, urlAtom } from '../store';

type PaginationProps = {
  pages: number;
  totalPages: number;
};

export const Pagination = ({ pages, totalPages }: PaginationProps) => {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const [page, setPage] = useAtom(pageAtom);
  const setUrl = useSetAtom(urlAtom);

  if (!queryBuilder || !totalPages) {
    return null;
  }

  if (!Number.isFinite(totalPages)) {
    return null;
  }

  const updatePage = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setUrl(queryBuilder.updatePageParam(index));
    setPage(index);
  };

  return (
    <CommonPagination updatePage={updatePage} currentPage={page} pages={pages} totalPages={totalPages} />
  );
};

export default Pagination;

import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const usePagination = ({
  totalItems,
  pageSize = 8,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const setPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const nextPage = () => {
    if (canGoNext) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (canGoPrev) setCurrentPage((prev) => prev - 1);
  };

  return useMemo(
    () => ({
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      setPage,
      nextPage,
      prevPage,
      canGoNext,
      canGoPrev,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, totalPages, startIndex, endIndex, canGoNext, canGoPrev]
  );
};

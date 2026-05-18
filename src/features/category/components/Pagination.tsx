import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const Pagination = ({ currentPage, totalPages, onPrev, onNext }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <FiChevronLeft />
        Previous
      </button>
      <div className="rounded-full bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
        {currentPage} / {totalPages}
      </div>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        Next
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;

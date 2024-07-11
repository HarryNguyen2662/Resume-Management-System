import { useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useGetResumesbyPagesQuery } from '@/services/apiSlice';

import { ResumesTable } from './resumes-table';

interface PaginationSelectionProps {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationSelection = ({ total, itemsPerPage, currentPage, setCurrentPage }: PaginationSelectionProps) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(total / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem key={idx} className={currentPage === page ? 'bg-neutral-100 rounded-md' : ''}>
        <PaginationLink onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis key="ellipsis-start" onClick={() => setCurrentPage(activePages[0] - 1)} />,
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() => setCurrentPage(activePages[activePages.length - 1] + 1)}
        />,
      );
    }

    return renderedPages;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePrevPage} />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

interface ResumesListBoardProps {
  filterOptions: string[];
}

export const ResumesListBoard = ({ filterOptions }: ResumesListBoardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const { data, isError, error, isLoading, isSuccess } = useGetResumesbyPagesQuery({
    page: currentPage,
    limit: itemsPerPage,
    keywords: filterOptions,
  });

  let content;
  const resumes = data?.resume || [];

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = <ResumesTable resumes={resumes} />;
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <div className="flex flex-col gap-5 mb-3">
      <div className="h-[530px] border-solid border-2 border-slate-400 rounded-xl p-4 overflow-auto">{content}</div>
      <PaginationSelection
        total={data?.totalCount ? data?.totalCount : 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

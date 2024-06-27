import type { Resume } from '@/interface/resume';

import { useState } from 'react';

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useGetResumesQuery } from '@/services/apiSlice';

interface ResumePreviewCardProps {
  resume: Resume;
}

interface PaginationSelectionProps {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ResumePreviewCard = ({ resume }: ResumePreviewCardProps) => {
  return (
    <div className="flex flex-col gap-5 border-solid border-2 h-fit border-neutral-400 rounded-md p-4">
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">{resume.name + ' ' + resume.id}</p>
        <p className=''>Uploaded: {resume.uploaded}</p>
      </div>
      <Button className='w-1/3 ml-auto'>Delete</Button>
    </div>
  );
};

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

export const ResumesListBoard = () => {
  const { data: resumes, isError, error, isLoading, isSuccess } = useGetResumesQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;

    content = resumes.slice(startIndex, endIndex).map(resume => <ResumePreviewCard key={resume.id} resume={resume} />);
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <div className="flex flex-col gap-5 mb-3">
      <div className="h-[530px] grid grid-cols-3 gap-4 border-solid border-2 border-slate-400 rounded-xl p-4 overflow-auto">
        {content}
      </div>
      <PaginationSelection
        total={resumes ? resumes.length : 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

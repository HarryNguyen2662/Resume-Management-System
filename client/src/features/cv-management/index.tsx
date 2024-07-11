import { useState } from 'react';

import { Header } from './components/header';
import { ResumesListBoard } from './components/resumes-list-board';

export const CVManagement = () => {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  
  return (
    <div className='flex justify-center px-7 mb-5'>
      <div className="flex flex-col max-w-screen-xl w-full gap-5">
        <Header filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
        <ResumesListBoard filterOptions={filterOptions} />
      </div>
    </div>
  );
};

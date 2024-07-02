import { AddNewResume } from './components/add-new-resume';
import { Header } from './components/header';
import { ResumesListBoard } from './components/resumes-list-board';

export const CVManagement = () => {
  return (
    <div className='flex justify-center px-7 mb-5'>
      <div className="flex flex-col max-w-screen-xl w-full gap-5">
        <Header />
        <ResumesListBoard />
        <AddNewResume />
      </div>
    </div>
  );
};

import { AddNewResume } from './components/add-new-resume';
import { Header } from './components/header';
import { ResumesListBoard } from './components/resumes-list-board';

export const CVManagement = () => {
  return (
    <div className='flex justify-center'>
      <div className="flex flex-col max-w-screen-xl w-full gap-5 mt-10">
        <Header />
        <ResumesListBoard />
        <AddNewResume />
      </div>
    </div>
  );
};

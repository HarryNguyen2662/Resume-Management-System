import type { Resume } from '@/interface/resume';

import { Button } from '@/components/ui/button'

interface ResumePreviewCardProps {
  resume: Resume;
}

export const ResumePreviewCard = ({ resume }: ResumePreviewCardProps) => {
  return (
    <div className="flex flex-col gap-5 border-solid border-2 h-fit border-neutral-400 rounded-md p-4">
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">{resume.name + ' ' + resume.id}</p>
        <p className="">Uploaded: {resume.uploaded}</p>
      </div>
      <Button className="w-1/3 ml-auto">Delete</Button>
    </div>
  );
};

import type { Resume } from '@/interface/resume';
import type { FormEvent } from 'react';

import { ChevronRightIcon, TrashIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteResumeByIdMutation } from '@/services/apiSlice';

interface ResumePreviewCardProps {
  resume: Resume;
}

export const ResumePreviewCard = ({ resume }: ResumePreviewCardProps) => {
  const navigate = useNavigate();
  const [deleteFile] = useDeleteResumeByIdMutation();

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    deleteFile(resume.id);
  };

  return (
    <div className="flex flex-col gap-5 border-solid border-2 h-fit border-neutral-400 rounded-md p-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="font-bold text-xl">{resume.profile.name}</p>
          <Button variant="outline" size="icon" onClick={() => navigate(`/resume/${resume.id}`)}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="">Uploaded: 26 Jun 2024</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume from system?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resume and remove its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button onClick={handleDelete}>Continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

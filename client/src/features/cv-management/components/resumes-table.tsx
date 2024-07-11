import type { Resume } from '@/interface/resume';

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDeleteResumeByIdMutation } from '@/services/apiSlice';

interface ResumesTableProps {
  resumes: Resume[];
}

export const ResumesTable = ({ resumes }: ResumesTableProps) => {
  const navigate = useNavigate();
  const [deleteFile] = useDeleteResumeByIdMutation();

  const handleDelete = async (resume: Resume) => {
    await deleteFile(resume.id).unwrap();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[270px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Upload date</TableHead>
          <TableHead>Delete</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map(resume => (
          <TableRow key={resume.id}>
            <TableCell className="font-medium">{resume.profile.name}</TableCell>
            <TableCell>{resume.profile.email}</TableCell>
            <TableCell>11 July 2024</TableCell>
            <TableCell className="">
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
                      This action cannot be undone. This will permanently delete the resume and remove its data from the
                      server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>
                      <Button onClick={() => handleDelete(resume)}>Continue</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="icon" onClick={() => navigate(`/resume/${resume.id}`)}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
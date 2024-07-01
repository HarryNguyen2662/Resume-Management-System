import type { TextItems } from '../lib/parse-resume-from-pdf/types';

import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadNewResumeMutation } from '@/services/apiSlice';

import { extractResumeFromSections } from '../lib/parse-resume-from-pdf/extract-resume-from-sections';
import { groupLinesIntoSections } from '../lib/parse-resume-from-pdf/group-lines-into-sections';
import { groupTextItemsIntoLines } from '../lib/parse-resume-from-pdf/group-text-items-into-lines';
import { readPdf } from '../lib/parse-resume-from-pdf/read-pdf';

const defaultFileState = {
  name: '',
  size: 0,
  fileUrl: '',
};

interface ResumeInputZoneProps {
  setPdf: React.Dispatch<React.SetStateAction<File | null>>;
  onFileUrlChange: (fileUrl: string) => void;
}

const ResumeInputZone = ({ onFileUrlChange, setPdf }: ResumeInputZoneProps) => {
  const [file, setFile] = useState(defaultFileState);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);

    setPdf(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const newFile = files[0];

    setNewFile(newFile);
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="resume">Resume</Label>
      <Input id="resume" type="file" onChange={onInputChange} />
    </div>
  );
};

export const AddNewResume = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [uploadFile, { isLoading }] = useUploadNewResumeMutation();
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const jsonData = extractResumeFromSections(sections);

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);

      setTextItems(textItems);
    }

    test();
  }, [fileUrl]);

  const canSave = [pdf, jsonData].every(Boolean) && !isLoading;

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (canSave && pdf && jsonData) {
      try {
        await uploadFile({ pdf, jsonData }).unwrap();
      } catch (err) {
        console.error('Failed to upload the file:', err);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Resume</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload new resume</DialogTitle>
          </DialogHeader>
          <ResumeInputZone setPdf={setPdf} onFileUrlChange={fileUrl => setFileUrl(fileUrl)} />
          <DialogFooter>
            <Button onClick={handleUpload}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import type { TextItems } from '../lib/parse-resume-from-pdf/types';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  onFileUrlChange: (fileUrl: string) => void;
}

const ResumeInputZone = ({ onFileUrlChange }: ResumeInputZoneProps) => {
  const [file, setFile] = useState(defaultFileState);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);

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
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);

      setTextItems(textItems);
    }

    test();
  }, [fileUrl]);

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
          <ResumeInputZone onFileUrlChange={fileUrl => setFileUrl(fileUrl)} />
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

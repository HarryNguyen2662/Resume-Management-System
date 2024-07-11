import type { TextItems } from '../lib/parse-resume-from-pdf/types';
import type { FormEvent } from 'react';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { useUploadNewResumeMutation } from '@/services/apiSlice';

import { extractResumeFromSections } from '../lib/parse-resume-from-pdf/extract-resume-from-sections';
import { groupLinesIntoSections } from '../lib/parse-resume-from-pdf/group-lines-into-sections';
import { groupTextItemsIntoLines } from '../lib/parse-resume-from-pdf/group-text-items-into-lines';
import { readPdf } from '../lib/parse-resume-from-pdf/read-pdf';

const defaultFileState = [
  {
    name: '',
    size: 0,
    fileUrl: '',
  },
];

interface ResumeInputZoneProps {
  setPdfs: React.Dispatch<React.SetStateAction<File[]>>;
  onFileUrlsChange: (fileUrls: string[]) => void;
}

const ResumeInputZone = ({ onFileUrlsChange, setPdfs }: ResumeInputZoneProps) => {
  const [files, setFiles] = useState(defaultFileState);

  const setNewFiles = (newFiles: File[]) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    files.forEach(file => {
      if (file.fileUrl) {
        URL.revokeObjectURL(file.fileUrl);
      }
    });

    const updatedFiles = newFiles.map(newFile => {
      const { name, size } = newFile;
      const fileUrl = URL.createObjectURL(newFile);

      return { name, size, fileUrl };
    });

    setPdfs(newFiles);
    setFiles(updatedFiles);
    onFileUrlsChange(updatedFiles.map(file => file.fileUrl));
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    setNewFiles(Array.from(files));
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="resume">Resume</Label>
      <Input id="resume" type="file" onChange={onInputChange} multiple /> {/* Add multiple attribute */}
    </div>
  );
};

export const AddNewResume = () => {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [textItems, setTextItems] = useState<TextItems[]>([]);
  const [uploadFile, { isLoading }] = useUploadNewResumeMutation();
  const lines = textItems.map(items => groupTextItemsIntoLines(items || []));
  const sections = lines.map(line => groupLinesIntoSections(line));
  const jsonData = sections.map(section => extractResumeFromSections(section));
  const [isOpen, setIsOpen] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    setIsOpen(true);

    const fetchTextItems = async () => {
      const promises = fileUrls.map(async url => {
        return await readPdf(url);
      });
      const results = await Promise.all(promises);

      setTextItems(results);
    };

    if (fileUrls.length > 0) {
      fetchTextItems();
    }
  }, [fileUrls]);

  const canSave = pdfs.length > 0 && jsonData.every(data => Boolean(data)) && !isLoading;

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (canSave && pdfs.length && jsonData.every(data => Boolean(data))) {
      try {
        for (let i = 0; i < pdfs.length; i++) {
          await uploadFile({ pdf: pdfs[i], jsonData: jsonData[i] }).unwrap();
        }
      } catch (err) {
        console.error('Failed to upload the file:', err);
      }
    }

    setIsOpen(false);
    toast({
      title: 'Successful!',
      description: 'The resumes have been uploaded.',
      className: 'bg-green-200',
    })
  };

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add New Resume
          </Button>
        </DialogTrigger>
        {isOpen && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload new resume</DialogTitle>
            </DialogHeader>
            <ResumeInputZone setPdfs={setPdfs} onFileUrlsChange={setFileUrls} />
            <DialogFooter>
              {isLoading ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button onClick={handleUpload}>Save</Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <Toaster />
    </div>
  );
};

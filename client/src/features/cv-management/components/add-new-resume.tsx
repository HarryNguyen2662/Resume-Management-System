import type { TextItems } from '../lib/parse-resume-from-pdf/types';
import type { FormEvent } from 'react';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import {
  //useSyncGoogleDriveMutation,
  useUploadNewResumeMutation,
  useUploadNewResumetoGoogleDriveMutation,
} from '@/services/apiSlice';

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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

let token_response = 'coderpush';

const ResumeInputZone = ({ onFileUrlsChange, setPdfs, setOpen }: ResumeInputZoneProps) => {
  const [files, setFiles] = useState(defaultFileState);
  const [openPicker] = useDrivePicker();
  //const [syncGoogleDrive] = useSyncGoogleDriveMutation();

  const [, setIsPickerOpen] = useState(false);
  //const [isSyncEnabled, setIsSyncEnabled] = useState(false);

  /*const toggleSync = () => {
    if (isSyncEnabled === false) handleSyncWithGoogleDrive;
    setIsSyncEnabled(!isSyncEnabled);
  };*/

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

  //https://cv-management-system.onrender.com/v1
  const downloadFileFromGoogleDrive = async (fileName: string, id: string) => {
    try {
      // Update the fetch URL to point to your server-side proxy endpoint
      const serverEndpoint = `https://cv-management-system.onrender.com/v1/resumePDF/downloadFileFromGoogleDrive/${encodeURIComponent(id)}`;
      const response = await fetch(serverEndpoint);

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.blob();
      const file = new File([data], fileName, { type: 'application/pdf' });

      return file;
    } catch (error) {
      console.error('Error downloading file:', error);

      return null;
    }
  };

  const handleSyncWithGoogleDrive = async () => {
    const googleSignInWindow = window.open(
      'https://cv-management-system.onrender.com/v1/resumePDF/auth/google',
      'googleSignIn',
      'width=500,height=600',
    );

    while (token_response === 'coderpush') {
      try {
        const response = await fetch('https://cv-management-system.onrender.com/v1/resumePDF/google/token', {
          credentials: 'include',
        });
        const { token } = await response.json();

        if (token !== null) {
          googleSignInWindow?.close();
          token_response = token;
          break;
        }
      } catch (error) {
        console.log(error);
      }
    }

    googleSignInWindow?.close();
  };

  const handleOpenPicker = async () => {
    try {
      const googleSignInWindow = window.open(
        'https://cv-management-system.onrender.com/v1/resumePDF/auth/google',
        'googleSignIn',
        'width=500,height=600',
      );

      const getToken = async () => {
        const response = await fetch('https://cv-management-system.onrender.com/v1/resumePDF/google/token', {
          credentials: 'include',
        });
        const { token } = await response.json();

        return token;
      };

      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      while (!(token_response = await getToken())) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }

      googleSignInWindow?.close();
      setIsPickerOpen(true);
      setOpen(false);

      openPicker({
        clientId: '579506460829-rojvfppgli45e7h6lvfjbtodsgil1vnd.apps.googleusercontent.com',
        developerKey: 'AIzaSyCgMmU-U93Gjym5NOHs2yGSWbwEe7d_afM',
        viewId: 'DOCS',
        token: token_response, // Use the dynamically obtained token
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        callbackFunction: async data => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button');
            setOpen(true);
          } else if (data.docs) {
            const selectedFiles = data.docs.map(doc => ({
              url: doc.url,
              name: doc.name,
              mimeType: doc.mimeType,
              id: doc.id,
            }));

            setOpen(true);
            console.log(selectedFiles);

            const myArray = [];

            for (let i = 0; i < selectedFiles.length; i++) {
              const file = await downloadFileFromGoogleDrive(selectedFiles[i].name, selectedFiles[i].id);

              if (file) {
                myArray.push(file);
              }
            }

            setNewFiles(myArray);
          }
        },
      });
    } catch (error) {
      console.error('Failed to open the picker due to an error:', error);
    }
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    setNewFiles(Array.from(files));
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="resume1">Upload from local device</Label>
      <Input id="resume2" type="file" onChange={onInputChange} multiple />
      <Label htmlFor="resume3">Import from Google Drive</Label>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() => handleOpenPicker()}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Choose Files
      </button>
      <Label htmlFor="resume4">Upload from local device and sync with Google Drive</Label>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() => handleSyncWithGoogleDrive()}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sync with Google Drive
      </button>
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
  const [uploadFileGoogleDrive] = useUploadNewResumetoGoogleDriveMutation();
  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(false);

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
          if (token_response !== 'coderpush') {
            await uploadFileGoogleDrive({
              pdf: pdfs[i],
              jsonData: jsonData[i],
            }).unwrap();
          }

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
    });
  };

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              console.log(isOpen);
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
            <ResumeInputZone setPdfs={setPdfs} onFileUrlsChange={setFileUrls} setOpen={setOpen} />
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

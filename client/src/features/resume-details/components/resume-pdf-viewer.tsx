import type { Resume } from '@/interface/resume';

import { usePDF } from '@react-pdf/renderer';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/features/cv-management/lib/redux/hooks';
import { selectSettings } from '@/features/cv-management/lib/redux/settingsSlice';
import { useRegisterReactPDFFont } from '@/hooks/fonts';

import { ResumePDF } from './ResumePDF';

interface ResumePdfViewerProps {
  resume: Resume;
}

const ResumePdfViewer = ({ resume }: ResumePdfViewerProps) => {
  const pdfUrl = resume.resumePdf.fileUrl;
  const settings = useAppSelector(selectSettings);

  useRegisterReactPDFFont();

  const document = useMemo(() => <ResumePDF resume={resume} settings={settings} isPDF={true} />, [resume, settings]);

  const [instance, updateInstance] = usePDF({ document });

  useEffect(() => {
    updateInstance(document);
  }, [document, resume, updateInstance]);

  return (
    <div className="flex flex-col items-center">
      <div className="h-[680px] p-3 mx-10 mb-5 border-solid border-2 border-slate-400 rounded-lg">
        <iframe src={`${pdfUrl}`} className="h-full w-full aspect-video" />
      </div>
      {!instance.loading && !instance.error && (
        <a href={instance.url!} download={resume.profile.name + ' - Resume'}>
          <Button variant="secondary" className="w-fit border-solid border-2 border-slate-300">
            Export Json Resume
          </Button>
        </a>
      )}
    </div>
  );
};

export default ResumePdfViewer;

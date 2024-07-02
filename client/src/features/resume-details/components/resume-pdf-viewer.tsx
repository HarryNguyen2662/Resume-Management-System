import { Button } from '@/components/ui/button';

interface ResumePdfViewerProps {
  pdfUrl: string;
}

const ResumePdfViewer = ({ pdfUrl }: ResumePdfViewerProps) => {
  return (
    <div className="w-1/2 flex flex-col items-center">
      <div className="h-[680px] p-3 mx-10 mb-5 border-solid border-2 border-slate-400 rounded-lg">
        <iframe src={`${pdfUrl}`} className="h-full w-full aspect-video" />
      </div>
      <Button variant="secondary" className="w-fit border-solid border-2 border-slate-300">
        Export
      </Button>
    </div>
  );
};

export default ResumePdfViewer;

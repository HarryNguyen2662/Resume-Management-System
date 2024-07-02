import { useParams } from 'react-router-dom';

import { useGetResumeByIdQuery } from '@/services/apiSlice';

import ResumePdfViewer from './components/resume-pdf-viewer';

import ParsedJsonViewer from './components/parsed-json-viewer';

const ResumeDetails = () => {
  const { id: resumeId } = useParams();

  const { data: resume, isSuccess } = useGetResumeByIdQuery(resumeId!);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  console.log(resume);
  const pdfUrl = resume.resumePdf.fileUrl;

  return (
    <div className="flex w-full overflow-hidden">
      <ResumePdfViewer pdfUrl={pdfUrl} />
      <ParsedJsonViewer />
    </div>
  );
};

export default ResumeDetails;

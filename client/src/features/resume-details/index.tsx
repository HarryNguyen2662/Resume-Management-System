import { useParams } from 'react-router-dom';

import { useGetResumeByIdQuery } from '@/services/apiSlice';

import ParsedJsonViewer from './components/parsed-json-viewer';
import ResumePdfViewer from './components/resume-pdf-viewer';

const ResumeDetails = () => {
  const { id: resumeId } = useParams();

  const { data: resume, isSuccess } = useGetResumeByIdQuery(resumeId!);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  console.log(resume);

  return (
    <div className="flex w-full overflow-hidden">
      <ResumePdfViewer resume={resume} />
      <ParsedJsonViewer />
    </div>
  );
};

export default ResumeDetails;

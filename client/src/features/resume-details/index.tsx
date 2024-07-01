import { useParams } from 'react-router-dom';

const ResumeDetails = () => {
  const { id: resumeId } = useParams();
  
  return (
    <div>ResumeDetails Page for resume id: {resumeId}</div>
  )
}

export default ResumeDetails;
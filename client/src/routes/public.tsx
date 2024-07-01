import { CVManagement } from '@/features/cv-management';
import ResumeDetails from '@/features/resume-details';

import { paths } from './paths';

export const routes = [
  {
    path: paths.home,
    element: <CVManagement />,
  },
  {
    path: paths.resume,
    element: <ResumeDetails />,
  },
];

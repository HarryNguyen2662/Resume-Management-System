import { CVManagement } from '@/features/cv-management';

import { paths } from './paths';

export const routes = [
  {
    path: paths.home,
    element: <CVManagement />,
  },
];

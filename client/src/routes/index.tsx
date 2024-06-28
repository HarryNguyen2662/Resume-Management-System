import { useRoutes } from 'react-router-dom';

import { routes } from './public';

export const AppRoutes = () => {
  const element = useRoutes(routes);

  return <>{element}</>;
};

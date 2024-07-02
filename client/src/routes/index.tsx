import { useRoutes } from 'react-router-dom';

import { NavBar } from '@/components/global/navbar';

import { routes } from './public';

export const AppRoutes = () => {
  const element = useRoutes(routes);

  return (
    <>
      <NavBar />
      {element}
    </>
  );
};

import { Font } from '@react-pdf/renderer';
import { useEffect } from 'react';

export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    Font.register({
      family: 'Roboto',
      fonts: [
        { src: '/fonts/Roboto-Regular.ttf' }, // Regular
        { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }, // Bold
      ],
    });
  }, []);
};

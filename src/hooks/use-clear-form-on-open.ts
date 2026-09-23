import { useEffect, useRef } from 'react';

export const useClearFormOnOpen = (clearValues: () => void): void => {
  const resetRef = useRef(clearValues);
  resetRef.current = clearValues;

  useEffect(() => {
    const clearForm = (): void => {
      resetRef.current();
    };

    clearForm();
    window.addEventListener('pageshow', clearForm);
    return () => window.removeEventListener('pageshow', clearForm);
  }, []);
};

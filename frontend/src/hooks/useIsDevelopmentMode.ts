import { useEffect, useState } from 'react';
import { getDevelopmentMode } from '../utils/config';

export const useIsDevelopmentMode = () => {
  const [isDev, setIsDev] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const mode = await getDevelopmentMode();
        setIsDev(mode);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsDev(false); // Default to prod if error
      }
    };

    fetchMode();
  }, []);

  return { isDev, error, isLoading: isDev === null };
};

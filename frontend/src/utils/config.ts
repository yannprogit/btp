let isDevelopmentModeCache: boolean | null = null;

export const getDevelopmentMode = async (): Promise<boolean> => {
  if (isDevelopmentModeCache !== null) {
    return isDevelopmentModeCache;
  }

  try {
    const response = await fetch('http://localhost:5000/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const data = await response.json();
    isDevelopmentModeCache = data.isDevelopmentMode === true;
    return isDevelopmentModeCache;
  } catch (error) {
    console.warn('Could not fetch development mode from backend, defaulting to false', error);
    isDevelopmentModeCache = false;
    return false;
  }
};

export const resetDevelopmentModeCache = () => {
  isDevelopmentModeCache = null;
};

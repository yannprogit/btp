import axios from 'axios';

export const formatErrorMessage = (error: unknown, isDevelopmentMode: boolean | null): string => {
  // Default to prod mode if isDev is null
  const isDev = isDevelopmentMode === true;

  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;

    if (isDev) {
      // Development mode: show detailed error from API
      return apiMessage || error.message || 'Une erreur s\'est produite.';
    } else {
      // Production mode: show generic message (don't expose API details)
      // Only show specific messages for auth/validation errors
      if (error.response?.status === 401) {
        return 'Session expirée. Veuillez vous reconnecter.';
      }
      if (error.response?.status === 403) {
        return 'Vous n\'avez pas accès à cette ressource.';
      }
      if (error.response?.status === 400) {
        return apiMessage || 'Données invalides. Veuillez vérifier votre saisie.';
      }
      if (error.response?.status === 404) {
        return 'Ressource non trouvée.';
      }
      // Generic error for everything else
      return 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  }

  // Non-Axios errors
  if (isDev) {
    return error instanceof Error ? error.message : String(error);
  }
  return 'Une erreur s\'est produite. Veuillez réessayer.';
};

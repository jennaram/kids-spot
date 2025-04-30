import { useState } from "react";

type ApiError = string | null;

export function useApiError() {
  const [error, setError] = useState<ApiError>(null);

  const handleApiError = (response: any, fallbackMessage = "Une erreur est survenue.") => {
    if (response?.data?.status === "error") {
      setError(response.data.message || fallbackMessage);
      return true;
    }
    return false;
  };

  const clearError = () => setError(null);

  return { error, handleApiError, clearError };
}
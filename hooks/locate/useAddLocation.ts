import { useState } from "react";
import { addLocation, NewLocation } from "@/api/locationServices";

export function useAddLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLocation = async (location: NewLocation, token: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await addLocation(location, token);
      if (response.statusCode === 201 || response.statusCode === 200) {
        setSuccess(true);
      } else {
        setError("Erreur lors de l'ajout du lieu.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return { submitLocation, loading, error, success };
}
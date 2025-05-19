export function handleApiError(error: unknown): string {
  // Vérification de la réponse d'erreur de l'API
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const responseData = (error as any).response.data; // Données d'erreur

    //console.log("Erreur complète API : ", responseData);  // Log de toute la réponse

    // Si l'API retourne des erreurs détaillées sur les champs
    if (responseData.errors) {
      //console.log("Erreurs par champ : ", responseData.errors);
      return `${responseData.message} ${Object.values(responseData.errors).join(' ')}`.trim();
    }

    return responseData.message || "Erreur inconnue lors de l'appel à l'API.";
  }

  // Cas où l'erreur ne correspond pas au format d'erreur attendu
  return "Erreur inconnue lors de l'appel à l'API.";
}
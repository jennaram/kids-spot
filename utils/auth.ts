/**
 * Vérifie que le token est présent
 * @param token - Token d'authentification
 */
export function checkToken(token: string) {
    if (!token) {
      throw new Error("Le token d'authentification est requis");
    }
  }
/**
 * Réponse d'API pour les opérations réussies sans données
 */
export interface ApiResponseSuccessOnly {
    status: "success";
    message: string;
    errors?: Record<string, string>; 
}

/**
* Réponse d'API en cas d'erreur
*/
export interface ApiResponseError {
    status: "error";
    message: string;
    errors?: Record<string, string>; 
}

/**
 * Réponse générique enveloppant n'importe quel type de données
 */
export interface ApiResponse<T> {
    success: import("/Users/moussa/Documents/codage/kidsSpot/kids-spot/types/user").ProfilUser | null;
    statusCode: number;
    data: T | null;
}
export interface AddLocationOrEventPayload {
    nom: string;
    description: string;
    horaires: string;
    adresse: string;
    ville: string;
    code_postal: string;
    longitude: number;
    latitude: number;
    telephone: string;
    site_web: string;
    id_type: number;
    equipements: number[];
    tranches_age: number[];
    date_debut?: string; // Optionnel -> présent si c'est un événement
    date_fin?: string; // Optionnel -> présent si c'est un événement
}
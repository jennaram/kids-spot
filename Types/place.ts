export interface Place {
    id: number;
    nom: string;
    horaires?: string;
    description?: string;
    adresse?: {
        adresse: string;
        code_postal: string;
        ville: string;
    };
    type?: {
        id: number;
        nom: string;
    }[];
    est_evenement: boolean;
    date_evenement?: {
        debut: string | null;
        fin: string | null;
    };
    position: {
        latitude: number;
        longitude: number;
        distance_km: number;
    };
    equipements?: { id: number; nom: string }[];
    ages?: { id: number; label: string }[];
}
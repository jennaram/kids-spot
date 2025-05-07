/**
 * Définition des interfaces pour le système de profils utilisateurs
 * Créé le: [DATE_DU_JOUR]
 */

// 🔹 Payloads (création/modification)
export interface ProfilData {
    pseudo: string;
    password?: string; // Mot de passe pour la création
    email: string;
    telephone?: string;
    reviewsCount?: number; // Nombre d'avis (pour la lecture)
}

export interface ProfilExtension {
    preferences?: string[];
    notifications_actives?: boolean;
}

export type CreateProfilPayload = ProfilData & {
    mot_de_passe: string;
};

export type UpdateProfilPayload = ProfilData & ProfilExtension & {
    id: number;
};

// 🔹 Structures partagées
export interface AdresseProfil {
    adresse?: string;
    ville?: string;
    code_postal?: string;
}

export interface Preference {
    id: number;
    nom: string;
}

export interface Avis {
    id: number;
    commentaire: string;
    note: number;
    date_creation: string;
    lieu_id?: number;
    lieu_nom?: string;
}

// 🔹 Profil complet (lecture)
export interface Profil {
    id: number;
    pseudo: string;
    email: string;
    telephone?: string;
    adresse?: AdresseProfil;
    date_inscription: string;
    derniere_connexion: string;
    preferences?: Preference[];
    notifications_actives: boolean;
    avis?: Avis[];
    nombre_avis: number;
    note_moyenne?: number;
}

// 🔹 Réponses API
export interface FetchProfilResponse {
    status: "success" | "error";
    data?: Profil;
    message?: string;
}

export interface FetchAllProfilsResponse {
    status: "success" | "error";
    data?: Profil[];
    message?: string;
}

// 🔹 Types pour les filtres
export interface ProfilFilterOptions {
    ville?: string;
    actif_depuis?: string;
    avec_avis?: boolean;
    tri_par?: 'date_inscription' | 'nombre_avis';
    ordre?: 'asc' | 'desc';
}
/**
 * Définition des interfaces pour le système de lieux
 * Créé le: 30/04/2025
 */

// 🔹 Payloads (création/modification)
export interface BaseLocationPayload {
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
}

export interface EventExtension {
    date_debut: string;
    date_fin: string;
}

export type AddLocationOrEventPayload =
    | BaseLocationPayload // Pour la création d'un lieu
    | (BaseLocationPayload & EventExtension); // Pour la création d'un événement

export type UpdateLocationOrEventPayload =
    | (BaseLocationPayload & { id: number }) // Mise à jour d'un lieu (l'ID est requis)
    | (BaseLocationPayload & EventExtension & { id: number }); // Mise à jour d'un événement (l'ID est requis)

// 🔹 Structures partagées
export interface Adresse {
    adresse: string;
    ville: string;
    code_postal: string;
    telephone: string;
    site_web: string;
}

export interface Type {
    id: number;
    nom: string;
}

export interface Position {
    latitude: number;
    longitude: number;
    distance_km: number;
}

export interface Equipement {
    id: number;
    nom: string;
}

export interface TrancheAge {
    id: number;
    nom: string;
}

export interface DateEvenement {
    debut: string;
    fin: string;
}

export interface Commentaire {
    pseudo: string;
    commentaire: string;
    note: number;
    date_ajout: string;
}

// 🔹 Lieu complet (lecture)
export interface Location {
    id: number;
    nom: string;
    description: string;
    horaires: string;
    adresse: Adresse;
    type: Type[];
    est_evenement: boolean;
    date_evenement: DateEvenement;
    position: Position;
    equipements: Equipement[];
    ages: TrancheAge[];
    commentaires?: Commentaire[];
    note_moyenne?: number;
    nombre_commentaires?: number;
    image_url?: string;
}

export type FetchAllLocation =  ({status: "success"} & {data: Location[]});

export type FetchLocation =  ({status: "success"} & {data: Location});


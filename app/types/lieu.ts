// types/models.ts
export interface Lieu {
  id: number;
  nom: string;
  description: string;
  horaires: string;
  adresse: {
    adresse: string;
    ville: string;
    code_postal: string;
    telephone: string;
    site_web: string;
  };
  type: {
    id: number;
    nom: string;
  }[];
  est_evenement: boolean;
  date_evenement: {
    debut: string;
    fin: string;
  };
  position: {
    latitude: number;
    longitude: number;
    distance_km?: number; // Optionnel car pas présent dans les données originales
  };
  equipements: {
    id: number;
    nom: string;
  }[];
  ages: {
    id: number;
    nom: string;
  }[];
  commentaires: {
    pseudo: string;
    commentaire: string;
    note: number;
    date_ajout: string;
  }[];
  note_moyenne: number;
  nombre_commentaires: number;
}
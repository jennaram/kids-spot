// types/models.ts
export interface Lieu {
    id: number;
    nom: string;
    horaires: string;
    adresse: {
      adresse: string;
      code_postal: string;
      ville: string;
    };
    description: string;
    type: {
      id: number;
      nom: string;
    }[];
    est_evenement: boolean;
    date_evenement: {
      debut: string | null;
      fin: string | null;
    };
    position: {
      latitude: number;
      longitude: number;
      distance_km: number;
    };
    equipements: string[];
    ages: string[];
  }
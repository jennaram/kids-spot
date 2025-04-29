import { apiDelete, apiGet, apiPost } from "@/services/apiClient";

export type NewLocation = {
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
  };
  
  export async function addLocation(newLocation: NewLocation, token: string) {
    checkToken(token);
    return apiPost('lieux/ajout', newLocation, token);
  }


function checkToken(token: string) {
  if (!token) {
    throw new Error("Le token d'authentification est requis");
  }
}

export async function deleteLocation(id_lieu: number, token: string) {
  checkToken(token);
  return apiDelete('lieux/supprime', { id_lieu }, token);
}

export async function fetchNearbyLocate(latitude: number, longitude: number, token: string) {
  return apiGet(`lieux/autour/${latitude}/${longitude}`, token);
}
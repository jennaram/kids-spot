import { useLocation } from "@/context/locate";

type Favori = {
  id: number;
  // autre(s) propriété(s) ?
};

export function useIsFavorite() {
  const { favorites } = useLocation();

  const isFavorite = (id: number): boolean => {
    if (!favorites) return false;
    return favorites.some((place: Favori) => place.id === id);
  };

  return { isFavorite };
}
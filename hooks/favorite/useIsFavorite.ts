import { useLocation } from "@/context/locate";

type Favori = {
  id: number;
  // autres propriétés si besoin
};

export function useIsFavorite() {
  const { favorites } = useLocation();

  const isFavorite = (id: number): boolean => {
    if (!favorites || favorites.length === 0) return false;
    return favorites.some((favori: Favori) => favori.id === id);
  };

  return { isFavorite };
}
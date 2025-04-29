import { useLocation } from '@/context/locate';

export function useIsFavorite() {
  const { favorites } = useLocation();

  const isFavorite = (id: number): boolean => {
    if (!favorites) return false;
    return favorites.some((place) => place.id === id);
  };

  return { isFavorite };
}
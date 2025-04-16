export type RootStackParamList = {
    Map: undefined;
    Calendar: undefined;
    Add: undefined;
    Favorites: undefined;
    // Ajoutez d'autres écrans ici au besoin
  };
  

  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
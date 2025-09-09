const FAVORITES_KEY = 'grace_haven_favorites';

export interface Favorite {
  userId: string;
  productId: string;
  createdAt: string;
}

export const favorites = {
  getFavorites: (userId: string): string[] => {
    const allFavorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray: Favorite[] = allFavorites ? JSON.parse(allFavorites) : [];
    return favoritesArray
      .filter(fav => fav.userId === userId)
      .map(fav => fav.productId);
  },

  addToFavorites: (userId: string, productId: string) => {
    const allFavorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray: Favorite[] = allFavorites ? JSON.parse(allFavorites) : [];
    
    const existingIndex = favoritesArray.findIndex(
      fav => fav.userId === userId && fav.productId === productId
    );
    
    if (existingIndex === -1) {
      favoritesArray.push({
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
      return true;
    }
    return false;
  },

  removeFromFavorites: (userId: string, productId: string) => {
    const allFavorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray: Favorite[] = allFavorites ? JSON.parse(allFavorites) : [];
    
    const updatedFavorites = favoritesArray.filter(
      fav => !(fav.userId === userId && fav.productId === productId)
    );
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  },

  isFavorite: (userId: string, productId: string): boolean => {
    const userFavorites = favorites.getFavorites(userId);
    return userFavorites.includes(productId);
  }
};
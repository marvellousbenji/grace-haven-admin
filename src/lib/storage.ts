import { Product, Booking, CartItem } from '@/types/product';

const PRODUCTS_KEY = 'grace_haven_products';
const BOOKINGS_KEY = 'grace_haven_bookings';
const CART_KEY = 'grace_haven_cart';
const FAVORITES_KEY = 'grace_haven_favorites';

export const storage = {
  // Products
  getProducts: (): Product[] => {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  addProduct: (product: Product) => {
    const products = storage.getProducts();
    products.push(product);
    storage.saveProducts(products);
  },

  updateProduct: (productId: string, updates: Partial<Product>) => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      storage.saveProducts(products);
    }
  },

  deleteProduct: (productId: string) => {
    const products = storage.getProducts().filter(p => p.id !== productId);
    storage.saveProducts(products);
  },

  getProduct: (productId: string): Product | undefined => {
    return storage.getProducts().find(p => p.id === productId);
  },

  // Bookings
  getBookings: (): Booking[] => {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  },

  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  },

  addBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    bookings.push(booking);
    storage.saveBookings(bookings);
  },

  updateBooking: (bookingId: string, updates: Partial<Booking>) => {
    const bookings = storage.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      storage.saveBookings(bookings);
    }
  },

  // Cart
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart: (cart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addToCart: (item: CartItem) => {
    const cart = storage.getCart();
    const existingIndex = cart.findIndex(
      c => c.productId === item.productId && c.size === item.size && c.color === item.color
    );
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    storage.saveCart(cart);
  },

  removeFromCart: (productId: string, size?: string, color?: string) => {
    const cart = storage.getCart().filter(
      c => !(c.productId === productId && c.size === size && c.color === color)
    );
    storage.saveCart(cart);
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
  },

  // Favorites  
  getFavoriteIds: (userId: string): string[] => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    return favoritesArray
      .filter((fav: any) => fav.userId === userId)
      .map((fav: any) => fav.productId);
  },

  addToFavorites: (userId: string, productId: string) => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    
    const existingIndex = favoritesArray.findIndex(
      (fav: any) => fav.userId === userId && fav.productId === productId
    );
    
    if (existingIndex === -1) {
      favoritesArray.push({
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    }
  },

  removeFromFavorites: (userId: string, productId: string) => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    
    const updatedFavorites = favoritesArray.filter(
      (fav: any) => !(fav.userId === userId && fav.productId === productId)
    );
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  }
};
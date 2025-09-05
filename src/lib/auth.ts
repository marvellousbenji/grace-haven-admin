import { User, SignUpData } from '@/types/user';

const USERS_KEY = 'grace_haven_users';
const CURRENT_USER_KEY = 'grace_haven_current_user';

export const authStorage = {
  // Get all users
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Save users to storage
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Find user by email
  findUserByEmail: (email: string): User | null => {
    const users = authStorage.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Create new user
  createUser: (userData: SignUpData): User => {
    const users = authStorage.getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    authStorage.saveUsers(users);
    
    // Also store password separately (in real app, this would be hashed)
    const passwords = JSON.parse(localStorage.getItem('grace_haven_passwords') || '{}');
    passwords[newUser.email] = userData.password;
    localStorage.setItem('grace_haven_passwords', JSON.stringify(passwords));

    return newUser;
  },

  // Verify user credentials
  verifyCredentials: (email: string, password: string): User | null => {
    const user = authStorage.findUserByEmail(email);
    if (!user) return null;

    const passwords = JSON.parse(localStorage.getItem('grace_haven_passwords') || '{}');
    if (passwords[email] === password) {
      return user;
    }
    return null;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem(CURRENT_USER_KEY);
    return userString ? JSON.parse(userString) : null;
  },

  // Set current user
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
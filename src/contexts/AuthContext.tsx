import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, SignUpData } from '@/types/user';
import { authStorage } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authStorage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = authStorage.verifyCredentials(email, password);
      if (user) {
        setUser(user);
        authStorage.setCurrentUser(user);
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${user.firstName}!`,
        });
        return true;
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Sign in error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signUp = async (userData: SignUpData): Promise<boolean> => {
    try {
      const newUser = authStorage.createUser(userData);
      setUser(newUser);
      authStorage.setCurrentUser(newUser);
      toast({
        title: "Account created!",
        description: `Welcome to Grace Haven, ${newUser.firstName}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    authStorage.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
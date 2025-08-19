import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulation d'une connexion réussie
      const mockUser = {
        id: 1,
        username: email.split('@')[0], // Crée un nom d'utilisateur à partir de l'email
        email: email,
      };
      const mockToken = 'fake-jwt-token-for-demo';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: 'Connexion réussie ! (Simulation)',
        description: `Bienvenue ${mockUser.username} !`,
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: 'Erreur de connexion (Simulation)',
        description: 'Une erreur inattendue est survenue.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Simulation d'une inscription réussie
      toast({
        title: 'Inscription réussie ! (Simulation)',
        description: 'Vous pouvez maintenant vous connecter.',
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: 'Erreur d\'inscription (Simulation)',
        description: 'Une erreur inattendue est survenue.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: 'Déconnexion',
      description: 'À bientôt !',
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
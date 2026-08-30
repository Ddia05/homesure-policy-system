import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('homesure_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          console.error('Failed to restore session:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('homesure_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('homesure_token', data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('homesure_token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('homesure_token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

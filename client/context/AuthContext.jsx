'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Stores user object
  const [loading, setLoading] = useState(true); // True until we check auth

const checkAuth = async () => {
  try {
   const res = await axios.get('http://localhost:5000/auth/current_user', {
    withCredentials: true,
  });

    if (res.status === 200) {
      setUser(res.data); 
    }
  } catch (err) {
    console.error('Auth check failed:', err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    checkAuth(); // Check auth on mount (auto-login)
  }, []);

  const login = (userData) => {
    setUser(userData); // Called after manual login
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth, loading }}>
      {/* Show nothing until auth check completes */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

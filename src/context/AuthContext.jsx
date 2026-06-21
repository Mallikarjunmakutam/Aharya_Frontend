// ============================================================
// AHARYA – Auth Context (API-based auth)
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const stored = localStorage.getItem('aharya_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.access) {
            // Fetch user profile
            const res = await api.get('/users/profile/');
            setUser({ ...res.data, name: res.data.full_name, ...parsed }); // merge tokens with profile
          }
        } catch (e) {
          console.error("Failed to restore session", e);
          localStorage.removeItem('aharya_user');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login/', { email, password });
      const tokens = { access: res.data.access, refresh: res.data.refresh };
      
      // Fetch profile after login
      localStorage.setItem('aharya_user', JSON.stringify(tokens));
      const profileRes = await api.get('/users/profile/');
      
      const userData = { ...profileRes.data, name: profileRes.data.full_name, ...tokens };
      setUser(userData);
      localStorage.setItem('aharya_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Invalid email or password' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/users/register/', { 
        full_name: name, 
        email, 
        password 
      });
      const userData = { 
        ...res.data.user, 
        name: res.data.user.full_name || name, 
        ...res.data.tokens 
      };
      setUser(userData);
      localStorage.setItem('aharya_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat();
        if (errors.length > 0) errorMessage = errors[0];
      }
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (token) => {
    try {
      const res = await api.post('/users/google-auth/', { token });
      const userData = { 
        ...res.data.user, 
        name: res.data.user.full_name, 
        ...res.data.tokens 
      };
      setUser(userData);
      localStorage.setItem('aharya_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.detail || 'Google authentication failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aharya_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

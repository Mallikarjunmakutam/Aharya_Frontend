// ============================================================
// AHARYA – Auth Context (localStorage-based dummy auth)
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('aharya_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('aharya_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const u = { name: found.name, email: found.email };
      setUser(u);
      localStorage.setItem('aharya_user', JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('aharya_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('aharya_users', JSON.stringify(users));
    const u = { name, email };
    setUser(u);
    localStorage.setItem('aharya_user', JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aharya_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

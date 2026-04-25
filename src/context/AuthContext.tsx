import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  province_id?: number;
  city_id?: number;
  postal_code?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const token = localStorage.getItem('customer_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/customer/session', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('customer_token');
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (data.token) localStorage.setItem('customer_token', data.token);
        setShowAuthModal(false);
        return { success: true };
      }

      return { success: false, message: data.message || 'Login gagal' };
    } catch (err) {
      return { success: false, message: 'Koneksi gagal. Coba lagi.' };
    }
  }

  async function register(email: string, password: string, name: string, phone?: string) {
    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (data.token) localStorage.setItem('customer_token', data.token);
        setShowAuthModal(false);
        return { success: true };
      }

      return { success: false, message: data.message || 'Registrasi gagal' };
    } catch (err) {
      return { success: false, message: 'Koneksi gagal. Coba lagi.' };
    }
  }

  async function logout() {
    try {
      await fetch('/api/customer/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('customer_token');
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, showAuthModal, setShowAuthModal, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

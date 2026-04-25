import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  two_factor_enabled: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; tempToken?: string; message?: string }>;
  verify2FA: (tempToken: string, code: string) => Promise<{ success: boolean; message?: string }>;
  setup2FA: () => Promise<{ secret: string; qrCodeUrl: string }>;
  enable2FA: (code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  async function checkAdminSession() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.user);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (err) {
      console.error('Admin session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        if (data.requires2FA) {
          return { success: true, requires2FA: true, tempToken: data.tempToken };
        }
        setAdmin(data.user);
        localStorage.setItem('admin_token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server error' };
    }
  }

  async function verify2FA(tempToken: string, code: string) {
    try {
      const response = await fetch('/api/auth/login/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setAdmin(data.user);
        localStorage.setItem('admin_token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server error' };
    }
  }

  async function setup2FA() {
    const token = localStorage.getItem('admin_token');
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    });
    return response.json();
  }

  async function enable2FA(code: string) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch('/api/auth/2fa/enable', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ code }),
      credentials: 'include'
    });
    const data = await response.json();
    if (response.ok) {
      setAdmin(prev => prev ? { ...prev, two_factor_enabled: true } : null);
      return { success: true };
    }
    return { success: false, message: data.message };
  }

  function logout() {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setAdmin(null);
    localStorage.removeItem('admin_token');
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, verify2FA, setup2FA, enable2FA, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}

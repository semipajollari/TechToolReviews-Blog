import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');

    if (storedToken && storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setToken(storedToken);
        setAdmin(adminData);
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const apiUrl = `${window.location.origin}/api/admin?action=login`;
    console.log('[AdminAuth] Attempting login to:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('[AdminAuth] Response status:', response.status);

      let data;
      const text = await response.text();
      console.log('[AdminAuth] Response text:', text.substring(0, 500));

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('[AdminAuth] JSON parse error:', parseError);
        return { success: false, error: `Server error: ${text.substring(0, 100)}` };
      }

      if (data.success && data.token) {
        setToken(data.token);
        setAdmin(data.admin);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        return { success: true };
      }

      return { success: false, error: data.message || `Login failed (${response.status})` };
    } catch (error: unknown) {
      const err = error as Error;
      console.error('[AdminAuth] Fetch error:', err);
      return { success: false, error: `Connection failed: ${err.message}` };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export default AdminAuthProvider;

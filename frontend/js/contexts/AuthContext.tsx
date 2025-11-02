import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { client } from '@/js/api/client.gen';
import { Urls } from '@/js/utils';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password1: string, password2: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      // Try to get current user from Django session
      const response = await fetch('/api/auth/user/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
  };

  const signup = async (username: string, email: string, password1: string, password2: string) => {
    const response = await fetch('/api/auth/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: JSON.stringify({ username, email, password1, password2 }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      // Don't auto-login, let user go to login page
      return;
    } else {
      const errorData = await response.json();
      const errorMessages: string[] = [];
      Object.values(errorData).forEach((errors) => {
        if (Array.isArray(errors)) {
          errorMessages.push(...errors);
        } else if (typeof errors === 'string') {
          errorMessages.push(errors);
        }
      });
      throw new Error(errorMessages.join(' ') || 'Signup failed');
    }
  };

  const logout = async () => {
    const response = await fetch('/api/auth/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
    });

    if (response.ok) {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}


import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'model_portfolio_token';
const USER_KEY = 'model_portfolio_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || ''
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const persistSession = (jwt, userData) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(userData)
    );

    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken('');
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      // There is no saved session
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      if (isMounted) {
        setLoading(true);
      }

      try {
        const response = await api.get('/auth/me');

        const profile = response.data.data;

        const normalizedUser = {
          ...profile,
          type: profile.type || 'client',
        };

        if (!isMounted) return;

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(normalizedUser)
        );

        setUser(normalizedUser);
      } catch (error) {
        // The saved token is invalid or expired.
        // Clear it directly instead of calling logout(),
        // which could trigger another state cycle.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (isMounted) {
          setToken('');
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (
    credentials,
    role = 'client'
  ) => {
    const endpoint =
      role === 'model'
        ? '/auth/admin/login'
        : '/auth/login';

    const response = await api.post(
      endpoint,
      credentials
    );

    const payload = response.data.data;

    const account =
      role === 'model'
        ? payload.admin
        : payload.client;

    const normalizedUser = {
      ...account,
      type: role === 'model' ? 'model' : 'client',
    };

    persistSession(
      payload.token,
      normalizedUser
    );

    return normalizedUser;
  };

  const register = async (credentials) => {
    const response = await api.post(
      '/auth/register',
      credentials
    );

    const payload = response.data.data;

    const normalizedUser = {
      ...payload.client,
      type: 'client',
    };

    persistSession(
      payload.token,
      normalizedUser
    );

    return normalizedUser;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};
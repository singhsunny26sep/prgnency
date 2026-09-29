import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id?: string;
  _id?: string;
  mobile?: string;
  name?: string;
  email?: string;
  sessionId?: string;
  isSignUpCompleted?: boolean;
  isProfileCompleted?: boolean;
  isOnBoardingCompleted?: boolean;
  currentScreen?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  needsProfile: boolean;
  updateUser: (patch: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';
const PROFILE_CACHE_KEY = '@profile_cache';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken) {
          setToken(storedToken);
          console.log('AuthContext loaded token from storage:', storedToken);
        }
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userRef.current = parsedUser;
          setUser(parsedUser);
          console.log('AuthContext loaded user from storage:', parsedUser);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (userData: User, authToken: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
      ]);
      setToken(authToken);
      userRef.current = userData;
      setUser(userData);
      console.log('AuthContext login - Token stored:', authToken);
      console.log('AuthContext login - User data:', userData);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const updateUser = async (patch: Partial<User>) => {
    const current = userRef.current;
    if (!current) {
      return;
    }
    const next = { ...current, ...patch };
    userRef.current = next;
    setUser(next);
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Failed to persist user update:', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
        AsyncStorage.removeItem(PROFILE_CACHE_KEY),
      ]);
      setToken(null);
      userRef.current = null;
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // The patients profile flag is the source of truth; isSignUpCompleted is the
  // older user-level flag kept for responses that carry no profile object.
  const profileCompleted = user?.isProfileCompleted ?? user?.isSignUpCompleted;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
        needsProfile: !!token && profileCompleted === false,
        updateUser,
      }}
    >
      {children}
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

export default AuthContext;

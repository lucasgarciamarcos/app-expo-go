// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { auth } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenar o usuario em caso de fallback
const USER_STORAGE_KEY = '@auth:user';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já temos o usuário no storage (fallback)
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    // Tentar configurar listener do Firebase
    try {
      console.log("Configurando auth state listener");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user?.email || "no user");
        setCurrentUser(user);
        
        // Armazenar o usuário para fallback
        if (user) {
          AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
        
        setLoading(false);
      }, (error) => {
        console.error("Auth state error:", error);
        checkStoredUser();
      });

      return unsubscribe;
    } catch (error) {
      console.error("Erro ao configurar auth listener:", error);
      checkStoredUser();
      return () => {};
    }
  }, []);

  async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Armazenar o usuário para fallback
    AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    return result;
  }

  async function register(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Armazenar o usuário para fallback
    AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    return result;
  }

  async function logout() {
    await signOut(auth);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
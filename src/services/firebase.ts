// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  initializeAuth
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Inicialização do app
const app = initializeApp(firebaseConfig);

// Inicialização explícita da autenticação com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export default app;
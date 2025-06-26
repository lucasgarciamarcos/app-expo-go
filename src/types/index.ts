// src/types/index.ts

// Tipo para mensagem
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

// Tipo para parâmetros de rotas
export type RootStackParamList = {
  Login: undefined;
  Chat: undefined;
};
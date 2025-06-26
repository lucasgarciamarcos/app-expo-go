# App Expo Go

Aplicativo mobile básico desenvolvido com Expo e React Native, focado em autenticação de usuários.

## Tecnologias

- React Native
- Expo
- Firebase Authentication
- TypeScript
- React Navigation

## Funcionalidades

- Login de usuário
- Autenticação com Firebase
- Persistência de sessão

## Como executar

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start

```

## Estrutura do projeto

```
src/
├── services/
│   └── firebase.ts     # Configuração do Firebase
├── screens/
│   └── Login/          # Tela de login
└── navigation/         # Navegação do app
```

## Configuração

1. Criar arquivo `.env` na raiz do projeto
2. Adicionar as variáveis do Firebase:
   ```
   FIREBASE_API_KEY=sua_api_key
   FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   FIREBASE_PROJECT_ID=seu_projeto_id
   ```

## Dependências principais

- `expo`: Framework para desenvolvimento
- `firebase`: Autenticação e backend
- `@react-navigation/native`: Navegação
- `@react-native-async-storage/async-storage`: Armazenamento local

---
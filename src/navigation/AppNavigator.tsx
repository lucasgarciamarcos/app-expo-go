// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

// Importar tipos
import { RootStackParamList } from '@/types';

// Importar telas
import LoginScreen from '@screens/LoginScreen';
import ChatScreen from '@screens/ChatScreen';

// Importar contexto de autenticação
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f5f5' }
        }}
      >
        {/* Importante: As telas devem estar sempre declaradas */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ animationTypeForReplace: currentUser ? 'push' : 'pop' }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
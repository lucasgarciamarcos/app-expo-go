// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, currentUser } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    // Redireciona se tiver usuário
    if (currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Chat" }],
      });
    }
  }, [currentUser, navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha email e senha.");
      return;
    }

    setIsLoading(true);

    try {
      // O redirecionamento será feito pelo useEffect quando currentUser mudar
      await login(email, password);
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível fazer login. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>Login</Text>

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                secureTextEntry
              />

              <Button
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                onPress={handleLogin}
                style={styles.loginButton}
              >
                Entrar
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 20,
    height: 50,
  },
});

export default LoginScreen;

// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const { currentUser, logout } = useAuth();
  const { colors, isDark } = useTheme();

  // Carregar dados mockados
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Olá! Como posso ajudar?',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
      }
    ];
    
    setMessages(mockMessages);
  }, []);

  // Rolar para o final das mensagens quando necessário
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário imediatamente
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simular resposta automática
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Recebi sua mensagem "${newMessage}". Obrigado pelo contato!`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao fazer logout. Tente novamente.');
    }
  };
  
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  // Nome de exibição do usuário com fallback seguro
  const getUserDisplayName = () => {
    if (!currentUser) return 'Você';
    return currentUser.name || currentUser.email || 'Você';
  };

  // Renderizar item de mensagem
  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === 'user';
    
    return (
      <View 
        style={[
          styles.messageBubble,
          isUserMessage ? 
            [styles.userBubble, { backgroundColor: colors.primary }] : 
            [styles.otherBubble, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]
        ]}
      >
        <View style={styles.messageHeader}>
          <Text 
            style={[
              styles.messageSender,
              { color: isUserMessage ? 'white' : colors.text }
            ]}
          >
            {isUserMessage ? getUserDisplayName() : 'App'}
          </Text>
          <Text 
            style={[
              styles.messageTime,
              { color: isUserMessage ? 'white' : colors.textSecondary }
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
        <Text 
          style={[
            styles.messageText,
            { color: isUserMessage ? 'white' : colors.text }
          ]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ChatApp</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={{ color: '#e74c3c' }}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {/* Mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {/* Indicador de digitação */}
      {isTyping && (
        <View style={[
          styles.messageBubble, 
          styles.otherBubble,
          { backgroundColor: isDark ? '#333' : '#f0f0f0' }
        ]}>
          <Text style={[styles.typingLabel, { color: colors.text }]}>ChatApp</Text>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, styles.typingDot1, { backgroundColor: colors.textSecondary }]} />
            <View style={[styles.typingDot, styles.typingDot2, { backgroundColor: colors.textSecondary }]} />
            <View style={[styles.typingDot, styles.typingDot3, { backgroundColor: colors.textSecondary }]} />
          </View>
        </View>
      )}
      
      {/* Input de mensagem */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: isDark ? '#333' : 'white',
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={isDark ? '#999' : '#777'}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              !newMessage.trim() && styles.disabledButton
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  messageList: {
    padding: 16,
    paddingBottom: 70, // Espaço extra no final
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  otherBubble: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontWeight: '600',
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    opacity: 0.7,
  },
  // Animação simulada com opacidades diferentes
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatScreen;
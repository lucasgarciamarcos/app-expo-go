import React from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? '#e74c3c' : colors.border,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={isDark ? '#666' : '#999'}
        {...rest}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
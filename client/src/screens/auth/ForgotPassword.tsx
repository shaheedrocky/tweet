import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { fontSize } from '../../utils/color';
import VectorIcon from '../../components/common/VectorIcon';

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      Alert.alert(
        'Reset Link Sent',
        'We have sent password reset instructions to your email address.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (err: any) {
      setError(err?.message || 'Error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <VectorIcon
                type="Ionicons"
                name="arrow-back"
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
            <VectorIcon
              type="Ionicons"
              name="logo-twitter"
              size={36}
              color={theme.primary}
            />
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>
              Find your X account
            </Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Enter the email address associated with your account to search for
              your profile and request a password reset email.
            </Text>

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error}
              </Text>
            ) : null}

            {/* Email Input */}
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { color: theme.text }]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              style={[
                styles.resetBtn,
                { backgroundColor: theme.text },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <Text
                  style={[
                    styles.resetBtnText,
                    { color: theme.background },
                  ]}
                >
                  Search
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    height: 44,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: fontSize.input,
    height: '100%',
  },
  resetBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});

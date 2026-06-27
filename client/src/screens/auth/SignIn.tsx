import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { fontSize } from '../../utils/color';
import VectorIcon from '../../components/common/VectorIcon';
import { Formik } from 'formik';
import * as yup from 'yup';

const SignIn = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const formikRef = useRef(null)

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),

    password: yup
      .string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
  });

  const handleSignIn = async (val: any) => {
    if (!val.email.trim() || !val.password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    try {
      await login(val.email, val.password);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header X Logo */}
          <View style={styles.header}>
            <VectorIcon
              type="Ionicons"
              name="logo-twitter"
              size={36}
              color={theme.primary}
            />
            <Text
              style={{
                color: theme.text,
                fontWeight: '800',
                fontSize: fontSize.title,
              }}
            >
              Tweet
            </Text>
          </View>

          {/* Form Content */}
          {/* Form Content */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={val => handleSignIn(val)}
            innerRef={formikRef}
          >
            {({
              dirty,
              values,
              errors,
              isValid,
              isSubmitting,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
            }) => (
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={styles.content}>
                  <Text style={[styles.title, { color: theme.text }]}>
                    See what's happening in the world right now.
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
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Phone, email, or username"
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, { color: theme.text }]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text
                      style={{
                        color: theme.error,
                        fontWeight: '500',
                        fontSize: fontSize.caption,
                        marginTop: 2,
                      }}
                    >
                      {errors.email}
                    </Text>
                  )}

                  {/* Password Input */}
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        marginTop: 16,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, { color: theme.text }]}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <VectorIcon
                        type="Feather"
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={18}
                        color={theme.textMuted}
                      />
                    </TouchableOpacity>
                  </View>

                  {touched.password && errors.password && (
                    <Text
                      style={{
                        color: theme.error,
                        fontWeight: '500',
                        fontSize: fontSize.caption,
                        marginTop: 2,
                      }}
                    >
                      {errors.password}
                    </Text>
                  )}

                  {/* Forgot Password */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={[styles.forgotBtn, { marginTop: 10 }]}
                  >
                    <Text style={[styles.forgotText, { color: theme.primary }]}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || !dirty || !isValid}
                    style={[
                      styles.loginBtn,
                      {
                        backgroundColor:
                          isSubmitting || !dirty || !isValid
                            ? 'grey'
                            : theme.text,
                      },
                    ]}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color={theme.background} />
                    ) : (
                      <Text
                        style={[styles.loginBtnText, { color: theme.background }]}
                      >
                        Log in
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{ borderTopColor: theme.border, borderTopWidth: 1, gap: 16 }}>
                  <Text style={{ color: theme.textMuted, fontSize: fontSize.caption, alignSelf: 'center', marginTop: 16 }}>OR SIGN IN WITH</Text>
                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: theme.text,
                      width: '100%',
                      height: 50,
                      borderRadius: 8,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    <VectorIcon
                      type="AntDesign"
                      name="google"
                      size={18}
                      color={theme.background}
                    />
                    <Text
                      style={{
                        color: theme.background,
                        fontWeight: '500',
                        fontSize: fontSize.subtitle,
                        textAlign: 'center',
                      }}
                    >
                      Continue with Google
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: theme.text,
                      width: '100%',
                      height: 50,
                      borderRadius: 8,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    <VectorIcon
                      type="FontAwesome"
                      name="apple"
                      size={18}
                      color={theme.background}
                    />
                    <Text
                      style={{
                        color: theme.background,
                        fontWeight: '500',
                        fontSize: fontSize.subtitle,
                        textAlign: 'center',
                      }}
                    >
                      Continue with Apple
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          {/* Footer Registration Redirect */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={{ color: theme.textMuted }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: theme.primary, fontWeight: '700' }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

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
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: '800',
    marginBottom: 24,
    lineHeight: 32,
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
  },
  input: {
    flex: 1,
    fontSize: fontSize.input,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
  },
});

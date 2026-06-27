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
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { fontSize } from '../../utils/color';
import VectorIcon from '../../components/common/VectorIcon';
import { Formik } from 'formik';
import * as yup from 'yup';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', // Female 1
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // Male 1
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', // Female 2
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', // Male 2
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', // Female 3
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Male 3
];

const SignUp = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const initialValues = {
    name: '',
    username: '',
    email: '',
    password: '',
    avatar: '',
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required('Full name is required'),
    username: yup
      .string()
      .trim()
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed')
      .required('Username is required'),
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
  });

  const handleSignUp = async (val: any) => {
    setError('');
    try {
      await register(val.name, val.username, val.email, val.avatar || undefined);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Try again.');
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

          {/* Form Content */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={val => handleSignUp(val)}
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
              setFieldValue,
            }) => {
              const handlePhotoUpload = async () => {
                try {
                  const response = await launchImageLibrary({
                    mediaType: 'photo',
                    selectionLimit: 1,
                    quality: 0.8,
                    maxWidth: 300,
                    maxHeight: 300,
                  });

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                    return;
                  }

                  if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage ?? 'Something went wrong');
                    return;
                  }

                  const asset = response.assets?.[0];

                  if (asset?.uri) {
                    setFieldValue('avatar', asset.uri);
                  }
                } catch (error) {
                  console.warn('Image picker error:', error);
                }
              };

              return (
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.title, { color: theme.text }]}>
                    Create your account
                  </Text>

                  {error ? (
                    <Text style={[styles.errorText, { color: theme.error }]}>
                      {error}
                    </Text>
                  ) : null}

                  {/* Profile Photo Selector (Native Local Upload) */}
                  <View style={styles.photoSection}>
                    <TouchableOpacity
                      onPress={handlePhotoUpload}
                      style={[
                        styles.avatarTouch,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'avatar' ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      {values.avatar ? (
                        <Image source={{ uri: values.avatar }} style={styles.avatarImage} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <VectorIcon type="Ionicons" name="camera-outline" size={32} color={theme.textMuted} />
                        </View>
                      )}
                      {/* Pencil Edit Badge */}
                      <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                        <VectorIcon type="Feather" name={values.avatar ? 'edit-2' : 'plus'} size={12} color="#fff" />
                      </View>
                    </TouchableOpacity>
                    <Text style={[styles.photoLabel, { color: theme.textMuted }]}>
                      {values.avatar ? 'Profile photo attached' : 'Add a profile photo'}
                    </Text>
                  </View>

                  {/* Full Name */}
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.surface,
                        borderColor: focusedInput === 'name' ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Full name"
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, { color: theme.text }]}
                      value={values.name}
                      onFocus={() => setFocusedInput('name')}
                      onChangeText={handleChange('name')}
                      onBlur={(e) => {
                        handleBlur('name')(e);
                        setFocusedInput(null);
                      }}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={[styles.validationError, { color: theme.error }]}>
                      {errors.name}
                    </Text>
                  )}

                  {/* Username */}
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.surface,
                        borderColor: focusedInput === 'username' ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Username (e.g. jenny_smith)"
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, { color: theme.text }]}
                      autoCapitalize="none"
                      value={values.username}
                      onFocus={() => setFocusedInput('username')}
                      onChangeText={handleChange('username')}
                      onBlur={(e) => {
                        handleBlur('username')(e);
                        setFocusedInput(null);
                      }}
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={[styles.validationError, { color: theme.error }]}>
                      {errors.username}
                    </Text>
                  )}

                  {/* Email address */}
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.surface,
                        borderColor: focusedInput === 'email' ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Email address"
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, { color: theme.text }]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={values.email}
                      onFocus={() => setFocusedInput('email')}
                      onChangeText={handleChange('email')}
                      onBlur={(e) => {
                        handleBlur('email')(e);
                        setFocusedInput(null);
                      }}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={[styles.validationError, { color: theme.error }]}>
                      {errors.email}
                    </Text>
                  )}

                  {/* Password */}
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.surface,
                        borderColor: focusedInput === 'password' ? theme.primary : theme.border,
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
                      onFocus={() => setFocusedInput('password')}
                      onChangeText={handleChange('password')}
                      onBlur={(e) => {
                        handleBlur('password')(e);
                        setFocusedInput(null);
                      }}
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
                    <Text style={[styles.validationError, { color: theme.error }]}>
                      {errors.password}
                    </Text>
                  )}

                  {/* Sign Up Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || !dirty || !isValid}
                    style={[
                      styles.signUpBtn,
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
                        style={[
                          styles.signUpBtnText,
                          { color: theme.background },
                        ]}
                      >
                        Create account
                      </Text>
                    )}
                  </TouchableOpacity>
               
                </ScrollView>
              );
            }}
          </Formik>

          {/* Footer Registration Redirect */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={{ color: theme.textMuted }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={{ color: theme.primary, fontWeight: '700' }}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
  scrollContent: {
    paddingVertical: 12,
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: '800',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  avatarTouch: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 54,
    marginTop: 12,
  },
  input: {
    flex: 1,
    fontSize: fontSize.input,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  validationError: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  signUpBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
  },
  avatarModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  avatarModalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarOptionWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2.5,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  avatarCloseBtn: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  avatarCloseText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
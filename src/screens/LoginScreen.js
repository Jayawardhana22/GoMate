import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormik } from 'formik'; // <--- USING THE HOOK HERE
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { loginUser } from '../store/authSlice';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Requirement: "Use React Hooks to handle form data"
  const formik = useFormik({
    initialValues: { username: 'emilys', password: 'emilyspass' },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        // Unwrap the Redux action to handle success/failure here
        await dispatch(loginUser(values)).unwrap();
        // Navigation is handled automatically by AppNavigator when user state changes
      } catch (err) {
        Alert.alert('Login Failed', err.message || 'Check your credentials');
      }
    },
  });

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="map" size={48} color={colors.white} />
            </View>
            <Text style={styles.title}>GoMate</Text>
            <Text style={styles.subtitle}>Your Travel Companion</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color={colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.textLight}
                onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
                value={formik.values.username}
                autoCapitalize="none"
              />
            </View>
            {formik.touched.username && formik.errors.username && (
              <Text style={styles.error}>{formik.errors.username}</Text>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={colors.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.textLight} 
                />
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.error}>{formik.errors.password}</Text>
            )}

            <CustomButton
              title="Login"
              onPress={formik.handleSubmit}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
            
            <Text style={styles.hint}>
              Demo: emilys / emilyspass
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 48 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: colors.white, marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
  formContainer: {
    backgroundColor: colors.white, borderRadius: 24, padding: 24,
    elevation: 8, shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 16,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lightBg,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12,
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: colors.textPrimary },
  error: { color: colors.error, fontSize: 12, marginBottom: 12, marginLeft: 4 },
  loginButton: { marginTop: 8 },
  link: { color: colors.primary, textAlign: 'center', marginTop: 20, fontSize: 14, fontWeight: '500' },
  hint: { color: colors.textLight, textAlign: 'center', marginTop: 12, fontSize: 12 },
});
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Owns the Sign In / Sign Up form's state and submission, for both the
 * phone+password flow and the (dummy, for now) Google sign-in flow.
 */
export function useAuthForm() {
  const { login, signup, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('traveler');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || !password) {
      Alert.alert('Required Fields', 'Please enter phone number and password');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        if (!name) {
          Alert.alert('Required Field', 'Please enter your name');
          setLoading(false);
          return;
        }
        await signup({ name, phone, password, role });
      }
      // No explicit navigation: AppNavigator swaps to the authenticated
      // stack automatically once AuthContext's `user` is set.
    } catch (err) {
      Alert.alert('Authentication Error', err.response?.data?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      Alert.alert('Authentication Error', 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    isLogin,
    setIsLogin,
    name,
    setName,
    phone,
    setPhone,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    role,
    setRole,
    loading,
    googleLoading,
    handleSubmit,
    handleGoogleSignIn,
  };
}

export default useAuthForm;

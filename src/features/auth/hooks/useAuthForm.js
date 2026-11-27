import { useState } from 'react';
import { GoogleSignInError } from '../../../api/google';
import { useAuth } from '../../../hooks/useAuth';
import haptics from '../../../utils/haptics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Owns the Sign In / Sign Up form's state and submission (email + password).
 */
export function useAuthForm() {
  const { login, signup, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Inline banner shown above the form: { type: 'info' | 'error', text }
  const [notice, setNotice] = useState(null);

  const toggleMode = () => {
    setIsLogin((v) => !v);
    setNotice(null);
  };

  const validate = () => {
    if (!isLogin && !name.trim()) return 'Please enter your full name';
    if (!email.trim() || !password) return 'Please enter your email and password';
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address';
    if (!isLogin && password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const problem = validate();
    if (problem) {
      setNotice({ type: 'error', text: problem });
      return;
    }

    setNotice(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await signup({ name: name.trim(), email: email.trim(), password });
      }
      // No explicit navigation: AppNavigator swaps to the authenticated
      // stack automatically once AuthContext's `user` is set.
    } catch (err) {
      const code = err.response?.data?.code;
      haptics.error();
      if (code === 'INVALID_CREDENTIALS') {
        // Deliberately vague (the server never says whether the email exists).
        setNotice({
          type: 'error',
          text: 'Incorrect email or password. New here? Tap Sign Up below. Forgot it? Reset your password.',
        });
      } else if (code === 'EMAIL_EXISTS') {
        setIsLogin(true);
        setNotice({ type: 'info', text: 'You already have an account. Sign in to continue.' });
      } else {
        setNotice({
          type: 'error',
          text:
            err.response?.data?.message ||
            (err.response
              ? 'Something went wrong. Please try again.'
              : 'Could not reach the server. Check your connection.'),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Native Google sheet -> server verifies the token (see AuthContext.loginWithGoogle).
  const handleGoogle = async () => {
    setNotice(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const text =
        err instanceof GoogleSignInError
          ? err.message
          : err.response?.data?.message || 'Google sign-in failed. Please try again.';
      setNotice({ type: 'error', text });
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    isLogin,
    toggleMode,
    notice,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    handleSubmit,
    googleLoading,
    handleGoogle,
  };
}

export default useAuthForm;

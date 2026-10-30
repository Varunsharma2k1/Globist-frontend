import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

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
      if (code === 'USER_NOT_FOUND') {
        // First-time user: move to sign up, keeping the email they typed.
        setIsLogin(false);
        setNotice({
          type: 'info',
          text: "We couldn't find an account for this email. Add your name to create one.",
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

  // Placeholder Google sign-in (see AuthContext.loginWithGoogle).
  const handleGoogle = async () => {
    setNotice(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setNotice({ type: 'error', text: 'Google sign-in failed. Please try again.' });
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

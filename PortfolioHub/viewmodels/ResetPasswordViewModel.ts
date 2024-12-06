import { useState } from 'react';
import { Alert } from 'react-native';
import { sendPasswordResetEmail } from '@firebase/auth';
import { auth } from '@/firebaseConfig';
import { Router } from 'expo-router';

const useResetPasswordViewModel = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (router: Router) => {
    if (!email) {
      Alert.alert('No Email Provided', 'Please enter your email address.');
      return;
    }
    // Email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset',
        'If this email is associated with an account, a password reset link has been sent.'
      );
      router.push('/'); // Navigate to the root screen
    } catch (error) {
        console.error(error.message);
        Alert.alert('Error!', 'An error occurred while sending the password reset link. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    handlePasswordReset,
  };
};

export default useResetPasswordViewModel;
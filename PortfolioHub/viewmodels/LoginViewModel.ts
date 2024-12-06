import { useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, firestore } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Router } from 'expo-router';

const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (router: Router) => {
    if (!email) {
      Alert.alert('No Email Provided', 'Please enter your email address.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('No Password Provided', 'Please enter your password.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        await updateDoc(doc(firestore, 'users', user.uid), { emailVerified: true });
        console.log('Email verified and Firestore updated.');
        router.push('/(tabs)/home'); // Navigate to home screen
      } else {
        Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
        await auth.signOut();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        const authError = error as { code?: string };
        console.log(authError);
        if (authError.code === 'auth/wrong-password') {
          Alert.alert('Wrong Password', 'The password is incorrect. Please try again.');
        } else if (authError.code === 'auth/invalid-credential') {
          Alert.alert('Invalid Credentials', 'Check your email and password and try again!');
        } else if (authError.code === 'auth/user-not-found') {
          Alert.alert('User not found', 'No user found with this email.');
        } else {
          Alert.alert('Login Failed', 'An unknown error occurred. Please try again later.');
        }
      } else {
        console.error('An unexpected error occurred.');
        Alert.alert('Login Failed', 'An unknown error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }    
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    togglePasswordVisibility,
    isLoading,
    handleLogin,
  };
};

export default useLoginViewModel;
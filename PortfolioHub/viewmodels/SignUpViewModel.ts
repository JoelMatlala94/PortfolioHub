import { useState } from 'react';
import { Alert } from 'react-native';
import { auth, firestore } from '@/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from '@firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const useSignUpViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('USA');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignup = async () => {
    if (!displayName) {
      Alert.alert('No Display Name Provided', 'Please enter a display name.');
      return;
    }
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      await setDoc(doc(firestore, 'users', user.uid), {
        displayName,
        email: user.email,
        country,
        emailVerified: false,
      });
      await sendEmailVerification(user);
      await signOut(auth);

      Alert.alert('Sign Up Successful', 'Please verify your email before logging in.');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        Alert.alert('Invalid Password', 'Your password should be at least 6 characters long!');
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email Taken', 'This email address is already in use.');
      } else {
        Alert.alert('Signup Failed', 'An error occurred. Please try again.');
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    country,
    setCountry,
    isPasswordVisible,
    togglePasswordVisibility,
    handleSignup,
  };
};

export default useSignUpViewModel;
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXU2TOG-ZlWULFQ55FdEacVmGkvv3EZBE",
  authDomain: "portfoliohub-63da0.firebaseapp.com",
  projectId: "portfoliohub-63da0",
  storageBucket: "portfoliohub-63da0.appspot.com",
  messagingSenderId: "1050582068501",
  appId: "1:1050582068501:web:9ce380531760526382cd1c",
  measurementId: "G-CNN0THLEW0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);

let persistence;
if (Platform.OS === 'web') {
  persistence = browserLocalPersistence;
} else {
  persistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence
});
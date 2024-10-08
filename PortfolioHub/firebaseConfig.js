import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { app, auth };
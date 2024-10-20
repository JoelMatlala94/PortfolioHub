import { useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { app, auth } from '@/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
  } from 'react-native';

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
    return (
        <View style={styles.authContainer}>
            <Text style={styles.title}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
            <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={isLogin ? 'Log In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
                </Text>
            </View>
        </View>
    );
}

const AuthenticatedScreen = ({ user, handleLogout }) => {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.emailText}>{user.email}</Text>
        <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
      </View>
    );
};

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Track user authentication state
    const [isLogin, setIsLogin] = useState(false); // Set initial state to false for sign-up page

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (user) {
            router.replace('(tabs)/home'); // Redirect to home page after sucessful signing up
        }
        });

        return () => unsubscribe();
    }, [auth]);

    
    const handleAuthentication = async () => {
        try {
            if (user) {
                // If user is already authenticated, log out
                console.log('User logged out successfully!');
                await signOut(auth);
            } else {
                // Sign in or sign up
                if (isLogin) {
                    // Sign in
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                } else {
                    // Sign up
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                }
            }
            } catch (error) {
                console.error('Authentication error:', error.message);
        }
    };
        
    return (
        <ScrollView contentContainerStyle={styles.container}>
        {user ? (
            // Show user's email if user is authenticated
            <AuthenticatedScreen user={user} handleLogout={handleAuthentication} />
        ) : (
            // Show sign-in or sign-up form if user is not authenticated
            <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
            />
        )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
      marginVertical: 40,
      flexDirection: 'row',
    },
    enabled: {
      backgroundColor: Colors.primary,
    },
    disabled: {
      backgroundColor: Colors.primaryMuted,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.background,
      },
      authContainer: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: '#3C3C4399',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
      },
      title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
      },
      input: {
        backgroundColor: '#3C3C4399',
        padding: 20,
        borderRadius: 16,
        fontSize: 20,
        marginRight: 10,
        color: 'white',
      },
      buttonContainer: {
        marginBottom: 16,
      },
      toggleText: {
        color: '#3498db',
        textAlign: 'center',
      },
      bottomContainer: {
        marginTop: 20,
      },
      emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
      },
  });

export default Signup;
export {};
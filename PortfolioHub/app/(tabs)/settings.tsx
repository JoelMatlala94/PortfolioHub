import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Auth, signOut, onAuthStateChanged } from '@firebase/auth';
import { app, auth } from '@/firebaseConfig';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [user, setUser] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.replace('/'); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        console.log('No user is signed in.');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Text style={styles.infoText}>
        {user ? `Logged in as: ${user.email}` : 'Not logged in'}
      </Text>

      <Button
        onPress={handleAuthentication}
        title={user ? "Sign Out" : "Sign In"}
        color="#FF3D00" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc', 
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333', 
  },
});

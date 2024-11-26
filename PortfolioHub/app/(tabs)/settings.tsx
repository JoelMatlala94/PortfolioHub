import { Button, StyleSheet, Alert, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Chip } from 'react-native-paper';

export default function SettingsScreen() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("Automatic"); // Initial theme setting
  const router = useRouter();
  const colorScheme = useColorScheme(); 
  const backgroundColor = colorScheme === 'dark' ? '#222' : '#f0f0f0'; 
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

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
        await signOut(auth);
        console.log('User logged out successfully!');
      } else {
        console.log('No user is signed in.');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            try {
              await deleteUser(auth.currentUser);
              console.log('Account deleted successfully.');
              router.replace('/');
            } catch (error) {
              console.error('Error deleting account:', error.message);
            }
          } 
        },
      ]
    );
  };

  const themeOptions = [
    { label: "Automatic", icon: "brightness-auto" },
    { label: "Light", icon: "wb-sunny" },
    { label: "Dark", icon: "dark-mode" },
  ];

  return (
    <View style={[styles.container]}>
      {/* Theme Selection */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Theme</Text>
        <View style={styles.themeOptions}>
          {themeOptions.map(({ label, icon }) => (
            <TouchableOpacity 
              key={label} 
              style={styles.radioOption} 
              onPress={() => setTheme(label)}
            >
              <MaterialIcons name={icon} size={24} color="#fff" />
              <Text style={styles.optionText}>{label}</Text>
              <RadioButton
                value={label}
                status={theme === label ? 'checked' : 'unchecked'}
                onPress={() => setTheme(label)}
                color="#1f8ef1"
                uncheckedColor="#888"
                style={styles.radioButton}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.infoText}>Automatic is only supported on operating systems that allow you to control the system-wide color scheme.</Text>
      </View>

    
      

      {/* Account Actions */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Account</Text>
        <Button title="Log Out" color="red" onPress={handleAuthentication} />
        <Button title="Delete Account" color="red" onPress={handleDeleteAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingItem: {
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 14,
    color: '#aaa',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  themeOptions: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add space between icon/text and radio button
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
    flex: 1, // Ensure text expands
  },
  radioButton: {
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
});
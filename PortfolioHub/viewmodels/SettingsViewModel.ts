import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useSettingsViewModel = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const username = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.replace("/"); //User gets sent back to root/index of app when not signed in.
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      Alert.alert(
        'Log Out',
        'Are you sure?', [
          { text: 'Cancel', style: 'cancel'} ,
          { text: 'Yes', onPress: async ()=> await signOut(auth), style: 'destructive'},
      ]);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        Alert.alert(
          "Delete Account",
          "Are you sure? This action is irreversible!",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes",
              onPress: async () => {
                try {
                  await deleteUser(user);
                  console.log("Account and all associated data deleted successfully!");
                } catch (error) {
                  console.error("Error during account deletion:", error.message);
                }
              },
              style: "destructive",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };  

  return {
    username,
    email,
    handleSignOut,
    handleDeleteAccount,
  };
};
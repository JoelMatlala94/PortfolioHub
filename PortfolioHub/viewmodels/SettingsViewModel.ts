import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

export const useSettingsViewModel = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

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
      await signOut(auth);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        console.log("Account deleted successfully!");
        router.replace("/"); //User gets sent back to root/index of app upon account deletion.
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return {
    handleSignOut,
    handleDeleteAccount,
  };
};
import React from "react";
import { Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettingsViewModel } from "@/viewmodels/SettingsViewModel";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const { theme, setTheme, currentThemeAttributes } = useTheme();
  const {
    handleSignOut,
    handleDeleteAccount,
  } = useSettingsViewModel();

  const themeOptions = [
    { label: "Automatic", icon: "brightness-auto" },
    { label: "Light", icon: "wb-sunny" },
    { label: "Dark", icon: "dark-mode" },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentThemeAttributes.backgroundColor },
      ]}
    >
      {/* Theme Selection */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: currentThemeAttributes.textColor }]}>
          Theme
        </Text>
        <View style={[ styles.themeOptions,
                     { backgroundColor: currentThemeAttributes.backgroundColor }]}>
          {themeOptions.map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={styles.radioOption}
              onPress={() => setTheme(label)}
            >
              <MaterialIcons name={icon} size={24} color={currentThemeAttributes.iconColor} />
              <Text style={[styles.optionText, { color: currentThemeAttributes.textColor }]}>
                {label}
              </Text>
              <RadioButton
                value={label}
                status={theme === label ? "checked" : "unchecked"}
                onPress={() => setTheme(label)}
                color={currentThemeAttributes.check}
                uncheckedColor="#888"
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.infoText, { color: currentThemeAttributes.textColor }]}>
          Automatic is only supported on operating systems that allow you to
          control the system-wide color scheme.
        </Text>
      </View>

      {/* Account Actions */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: currentThemeAttributes.textColor }]}>
          Account
        </Text>
        <Button title="Log Out" color="red" onPress={handleSignOut} />
        <Button title="Delete Account" color="red" onPress={handleDeleteAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    marginBottom: 30,
    backgroundColor: "FFF",
  },
  settingLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  themeOptions: {
    borderRadius: 8,
    padding: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    marginTop: 10,
  },
});
import React from "react";
import { Button, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettingsViewModel } from "@/viewmodels/SettingsViewModel";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsView() {
  const { theme, setTheme, currentThemeAttributes } = useTheme();
  const {
    username,
    email,
    handleSignOut,
    handleDeleteAccount,
  } = useSettingsViewModel();

  const themeOptions: { label: typeof theme; icon: string }[] = [
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
      <View style= {[styles.settingItem, 
                   {backgroundColor: currentThemeAttributes.backgroundColor, 
                    borderColor: currentThemeAttributes.textShadowColor, 
                    shadowColor: currentThemeAttributes.textShadowColor}]}>
        <Text style={[styles.accountLabel, { color: currentThemeAttributes.textColor, 
                                             backgroundColor: currentThemeAttributes.backgroundColor,
                                             borderColor: currentThemeAttributes.textShadowColor, 
                                             textShadowColor: currentThemeAttributes.textShadowColor}]}>
          {username}
          
        </Text>
        <Text style={[styles.infoText, { color: currentThemeAttributes.textColor, 
                                         backgroundColor: currentThemeAttributes.backgroundColor, 
                                         textAlign: 'center',
                                         marginTop: 1}]}>
          {email}
        </Text>
      </View>
      {/* Theme Selection */}
      <View style={[styles.settingItem, 
                   {backgroundColor: currentThemeAttributes.backgroundColor, 
                    borderColor: currentThemeAttributes.textShadowColor, 
                    shadowColor: currentThemeAttributes.textShadowColor}]}>
        <Text style={[styles.settingLabel, { color: currentThemeAttributes.textColor, backgroundColor: currentThemeAttributes.backgroundColor }]}>
          Theme
        </Text>
        <View style={[ styles.themeOptions,
                     { backgroundColor: currentThemeAttributes.backgroundColor }]}>
          {themeOptions.map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={[styles.radioOption, 
                     {borderColor: currentThemeAttributes.textShadowColor, 
                      shadowColor: currentThemeAttributes.textShadowColor}]}
              onPress={() => setTheme(label)}
            >
              <MaterialIcons name={icon as any} size={24} color={currentThemeAttributes.iconColor} />
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
      <View style={[styles.settingItem, 
                  {backgroundColor: currentThemeAttributes.backgroundColor, 
                   borderColor: currentThemeAttributes.textShadowColor, 
                   shadowColor: currentThemeAttributes.textShadowColor }]}>
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
    padding: 12,
    borderRadius: 24,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 4 },
    shadowRadius: 10
  },
  settingLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  accountLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 1
  },
  themeOptions: {
    borderRadius: 8,
    padding: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 4 },
    shadowRadius: 10,
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
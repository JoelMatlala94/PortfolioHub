import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useResetPasswordViewModel from '@/viewmodels/ResetPasswordViewModel';

const ResetPasswordView = () => {
  const router = useRouter();
  const { email, setEmail, isLoading, handlePasswordReset } = useResetPasswordViewModel();

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require('@/assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
      {/* Blur View */}
      <BlurView intensity={50} style={styles.absolute}>
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.image} />
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={20} color="#4d4d4d" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#7a7a7a"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePasswordReset(router)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  absolute: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: '#ccc',
  },
  image: {
    marginBottom: 60,
    borderRadius: 5,
    height: 210,
    width: 210,
    alignSelf: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 55,
    shadowColor: '#e6e9f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    marginLeft: 10,
    width: '100%',
  },
  icon: {
    marginTop: 2,
  },
  button: {
    backgroundColor: '#2545bd',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 150,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ResetPasswordView;
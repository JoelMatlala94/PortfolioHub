import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useLoginViewModel from '@/viewmodels/LoginViewModel';

const LoginView = () => {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    togglePasswordVisibility,
    isLoading,
    handleLogin,
  } = useLoginViewModel();

  return (
    <View style={styles.container}>
      <Video
        source={require('@/assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
      <BlurView intensity={50} style={styles.absolute}>
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.image} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="#4d4d4d" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@domain.com"
                  placeholderTextColor="#7a7a7a"
                  keyboardType="email-address"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} color="#4d4d4d" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#7a7a7a"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#4d4d4d"
                    style={styles.iconRight}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLogin(router)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            <View style={styles.footer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.footerText}>Need an Account? </Text>
                <Text onPress={() => router.replace('/signup')} style={styles.linkText}>
                  Sign Up
                </Text>
              </View>
              <Text onPress={() => router.push('/ResetPassword')} style={styles.linkText}>
                Forgot Password?
              </Text>
            </View>
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
    image: {
        marginBottom: 60,
        borderRadius: 5,
        height: 210,
        width: 210,
    },
    inputContainer: {
        width: '100%', 
        paddingHorizontal: 24,
        marginVertical: 12, 
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#ccc',
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
        width: '100%',
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
    iconRight: {
        marginLeft: 10,
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
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        marginTop: 25,
    },
    footerText: {
        marginVertical: 8,
        color: '#ccc',
    },
    linkText: {
        textDecorationLine: 'underline', 
        marginVertical: 8,
        color: '#ccc',
    },
});

export default LoginView;
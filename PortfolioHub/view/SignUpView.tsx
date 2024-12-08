import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { ResizeMode, Video } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import useSignUpViewModel from '@/viewmodels/SignUpViewModel';
import { useRouter } from 'expo-router';

const SignUpView = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    country,
    setCountry,
    isPasswordVisible,
    togglePasswordVisibility,
    handleSignup,
  } = useSignUpViewModel();
  const router = useRouter();
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

            {/* Display Name Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Display Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={20} color="#4d4d4d" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Display Name"
                  placeholderTextColor="#7a7a7a"
                />
              </View>
            </View>

            {/* Email Field */}
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

            {/* Password Field */}
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
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#4d4d4d"
                    style={styles.iconRight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Country Field */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapperCountry}>
                <Icon name="globe-outline" size={20} color="#4d4d4d" style={styles.icon} />
                <RNPickerSelect
                  onValueChange={(value) => setCountry(value)}
                  items={[
                    { label: 'United States', value: 'USA' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  style={{
                    inputIOS: pickerSelectStyles.input,
                    inputAndroid: pickerSelectStyles.input,
                  }}
                  placeholder={{}}
                  value={country}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.footerText}>Already have an Account? </Text>
                <Text onPress={() => router.replace('/login')} style={styles.linkText}>
                  Log In
                </Text>
              </View>
              <Text onPress={() => router.replace('/ResetPassword')} style={styles.linkText}>
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
      alignItems: 'center',
      padding: 16,
      width: '100%',
  },
  image: {
      marginTop: 60,
      marginBottom: 40,
      borderRadius: 5,
      height: 150,
      width: 150,
  },
  inputContainer: {
      width: '100%', 
      paddingHorizontal: 24,
      marginVertical: 6, 
  },
  label: {
      fontSize: 18,
      marginBottom: 8,
      color: '#ccc',
  },
  icon: {
    marginTop: 2, 
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
  inputWrapperCountry: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 25,
      paddingHorizontal: 8,
      height: 48,
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
  button: {
    backgroundColor: '#2545bd',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
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
      marginBottom: 45,
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
  iconRight: {
    marginLeft: 10,
    marginTop: 2,
  },
});

const pickerSelectStyles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: 21,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowOpacity: 0,
  },
});

export default SignUpView;
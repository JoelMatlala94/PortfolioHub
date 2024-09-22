import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('portfolio'); // When pressed it will bring user to portfolio tab/screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.title}>Portfolio Net Worth:</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.net_worth}>$123,456.78</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.row}>
        <Text style={styles.calculations}>Annual Dividend Income</Text>
        <Text style={styles.value}>$X,XXX.XX</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.calculations}>Monthly Dividend Income</Text>
        <Text style={styles.value}>$XXX.XX</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.calculations}>Weekly Dividend Income</Text>
        <Text style={styles.value}>$XX.XX</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.calculations}>Daily Dividend Income</Text>
        <Text style={styles.value}>$X.XX</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.calculations}>Yield</Text>
        <Text style={styles.value}>X.XX%</Text>
      </View>  
      </TouchableOpacity>                           
    </View> // ^ Value will be calculated based on users portfolio.
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 0, // Add some padding to the top
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '0%',
  },
  net_worth: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 5,
  },
  calculations: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});
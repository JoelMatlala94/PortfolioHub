import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import HomePortfolioView from '@/components/HomePortfolioView';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomePortfolioView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 0, // Add some padding to the top
  }
});
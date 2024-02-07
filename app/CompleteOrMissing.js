import { StyleSheet, ScrollView, Image } from 'react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';


export default function CompleteOrMissing() {
  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.message}>
          This Quraan Khatam or Tasbeeh Reading has been completed. Jazakallah Khair for your participation!
        </Text>
        <Image style = {styles.image} source={require('../assets/complete.png')} />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold', 
    textAlign: 'center',
    marginVertical: 20,
    color: '#9FCC2E',
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',  
  },
});

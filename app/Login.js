import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { AlertNotificationRoot, Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { router } from 'expo-router';
import DropdownAlert, { DropdownAlertType } from "react-native-dropdownalert";

let alert = (DropdownAlertData) =>
  new Promise((res) => res(DropdownAlertData));

export default function Login() {
  const [username, setUsername] = useState('');

  // Save the data into the async storage 
  const saveData = async () => {
  
    if (username === '') {
      const alertData = await alert({
        type: DropdownAlertType.Warn,
        message: "Please enter a username",
      });
      return;
    }
  
    try {
      // Wait for AsyncStorage to save data
      await AsyncStorage.setItem('username', username);
  
      // Show success toast after AsyncStorage save
      const alertData = await alert({
        type: DropdownAlertType.Success,
        message: "Username saved successfully!",
      });
      // Navigate to the home screen after 1 second
      setTimeout(() => {
        router.navigate('Home');
      }, 1000);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  


  return (
    <>
      <DropdownAlert ref={(ref) => (alert = ref)} />
      <GestureHandlerRootView style={{ flex: 1 }}> 
      <View style={styles.mainContainer}> 
        <Text style = {styles.headingText}>Please enter your username</Text>
        <TextInput
          placeholder='Username'
          style={styles.input}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={() => saveData()}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
    headingText: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: 10,
      textAlign: 'center',
      color: "#F4F4FC"
    },
    input: {
      height: 40,
      borderColor: '#F4F4FC',
      borderWidth: 1,
      margin: 10,
      paddingLeft: 10,
      borderRadius: 5,
      width: '80%',
      color: "#F4F4FC"
    },
    button: {
      backgroundColor: '#8EBBFF',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#24293E',
    },
    
  });
  

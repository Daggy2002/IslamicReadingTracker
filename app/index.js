import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Page() {

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('username');

        if (value != null) {
          router.replace('/Home');
        } else {
          router.replace('/Login');
        }

      } catch (error) {
        console.error('Error checking login:', error);
      }
    };

    checkLogin();
  }, []);


  return  (
    <></>
  );
}



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertNotificationRoot, Toast, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { collection, doc, updateDoc, getDocs, getDoc , query, where} from 'firebase/firestore/lite';

import db from '../firebase';
import AdditionalCirclesLegend from './CircleDescription';

const OutlinedCircleWithNumber = ({ number, onPress, onLongPress, color }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={[styles.circle, { backgroundColor: color }, animatedStyle]}>
        <Text style={styles.number}>{number}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CirclesGrid = ({ data, username, code}) => {
  const [circleColors, setCircleColors] = useState(Array(30).fill('#f4f4fc'));
  const [hasChanges, setHasChanges] = useState(false);
  const [allRead, setAllRead] = useState(false);

  useEffect( () => {
    //Check if all the circles are read
    setAllRead(data.data.every(item => item.status === 'read'));
  }, [data]);

  useEffect( () => {
    // Update circle colors based on data from prop
    const newColors = Object.values(data.data).map(({ status, name }) => {
      if (status === 'none') return '#f4f4fc';
      if (status === 'read') return '#9fcc2e';
      if (status === 'assigned' && name === username) return '#8ebbff';
      return '#2F3855';
    });
    setCircleColors(newColors);
  }, [data]);

  const handlePress = (index) => {
    const color = circleColors[index];
    // Check if the color is clickable
    if (color === '#f4f4fc' || color === '#9fcc2e' && data.creator === username || color === '#8ebbff') {
      setCircleColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = color === '#8ebbff' ? '#f4f4fc' : '#8ebbff';
        setHasChanges(true);
        updateData(index, newColors); // Pass the updated colors to updateData
        return newColors;
      });
    }
    else{
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This para has already been taken by someone else",
      });
    }
  };
  
  const handleLongPress = (index) => {
    const color = circleColors[index];
    console.log(data.data[index].name);
    // Check if the color is clickable
    if (color === '#f4f4fc' || color === '#9fcc2e' && data.data[index].name === username || color === '#8ebbff') {
      setCircleColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = color === '#9fcc2e' ? '#f4f4fc' : '#9fcc2e';
        setHasChanges(true);
        updateData(index, newColors); // Pass the updated colors to updateData
        return newColors;
      });
    }
    else{
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This para has already been taken by someone else",
      });
    }
  };
  
  const updateData = (index, newColors) => {
    const newData = { ...data };
    const color = newColors[index]; // Use the updated colors array
    let status = 'none';
  
    if (color === '#f4f4fc') {
      status = 'none';
    } else if (color === '#373739' || color === '#9fcc2e') {
      status = 'read';
    } else if (color === '#8ebbff' || color === '#8ebbff') {
      status = 'assigned';
    }

    newData.data[index].name = username;
    newData.data[index].status = status;
    data = newData;

  };
  

  const renderCircles = () => {
    return Array.from({ length: 30 }, (_, index) => (
      <OutlinedCircleWithNumber
        key={index}
        number={index + 1}
        onPress={() => handlePress(index)}
        onLongPress={() => handleLongPress(index)}
        color={circleColors[index]}
      />
    ));
  };


  const handleSave = async () => {
    setHasChanges(false);
  
    // Get the reference to the 'Code1' document
    const code1DocRef = doc(db, 'Codes', code);
  
    try {
      // Fetch the current data of the document
      const docSnapshot = await getDoc(code1DocRef);
  
      // Update the data based on your requirements
      const updatedData = data
      setAllRead(updatedData.data.every(item => item.status === 'read'));
      // Update the document with the new data
      await updateDoc(code1DocRef, updatedData);
  
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Selection saved successfully!',
        autoClose: 2000,
      });
  
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: 'Error saving selection. Please try again.',
      });
    }
  };

  console.log(allRead);

  return (
    <AlertNotificationRoot>
    <View>
      <Text style={styles.heading}>{data.title}</Text>
      {allRead ? (
        <View>
        <Text style={styles.completeMessage}>The Khatam is complete, thanks for participating</Text>
        <Image style = {styles.image} source={require('../assets/complete.png')} />
        </View>
      ) : (
        <>
          <View style={styles.gridContainer}>
            {renderCircles().map((circle, index) => (
              <View key={index} style={styles.circleContainer}>
                {circle}
              </View>
            ))}
          </View>
          <Text style={styles.description}>You can quickly tap or press and hold to switch the circle colors.</Text>
          {hasChanges && (
              <Button mode="contained" onPress={handleSave} style={styles.button} color="#2faa4b">
                Save Selection
              </Button>
            )}
            {/* Conditionally render the AdditionalCirclesLegend */}
            {!hasChanges && <AdditionalCirclesLegend />}

        </>
      )}
    </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#2faa4b',
  },
  completeMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
    color: '#9FCC2E',
  },
  buttonText: {
    color: '#f4f4fc',
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#f4f4fc',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    margin: 15,
    color: '#f4f4fc',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  circleContainer: {
    width: '17%',
    alignItems: 'center',
    margin: 2,
    padding: 2,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  number: {
    fontSize: 22,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',  
  },
});

export default CirclesGrid;

// AdditionalCirclesLegend.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OutlinedCircleWithNumber = ({ color }) => {
  return (
    <TouchableOpacity style={[styles.circle, { backgroundColor: color }]}>
      <Text></Text>
    </TouchableOpacity>
  );
};

const AdditionalCirclesLegend = () => {
  const additionalCircles = [
    { color: '#8EBBFF', description: 'assigned to you' },
    { color: '#2F3855', description: 'assigned to someone else' },
    { color: '#9FCC2E', description: 'complete' },
    { color: '#F4F4FC', description: 'not assigned to anyone'},
  ];

  return (
    <View style={styles.legendContainer}>
      {additionalCircles.map(({ color, description }, index) => (
        <View key={index} style={styles.circleContainer}>
          <OutlinedCircleWithNumber color={color} />
          <Text style={styles.description}>{description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'column', // Stack circles and descriptions horizontally
    justifyContent: 'center',
    margin: 10,
  },
  circleContainer: {
    flexDirection: 'row', // Stack circle and description vertically
    alignItems: 'center',
    margin: 1,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    color: '#f4f4fc',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
});

export default AdditionalCirclesLegend;

import React, { useState, useEffect } from 'react';
import { Card, Text, Menu } from 'react-native-paper';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardComponent = ({ onClick, pressDelete, cardData }) => {
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [codeData, setCodeData] = useState(cardData);

  useEffect(() => {
    setCodeData(cardData);
  }, [cardData]);

  const imageArray = [
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1563300365-9c77e472e7a5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1608366723754-b1ce9fedb1f6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1566941902337-b5b60fbc3314?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1551041776-b00e405980f8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  const openMenu = (index) => {
    setVisible(true);
    setActiveCard(index);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const getStyle = (index) => {
    switch (cardData[index].type) {
      case 'Khatam':
        return styles.cardCoverKhatam;
      case 'Tasbeeh':
        return styles.cardCoverTasbeeh;
      default:
        return styles.cardCoverNotFound;
    }
  };

  return (
    <>
      {codeData && codeData.map((code, index) => (
        <TouchableOpacity key={index} onPress={() => onClick(index)}>
          <Card style={styles.card}>
            <Card.Cover style={getStyle(index)} />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>{cardData[index].title || "Not Found"}</Text>
              <View style={styles.optionsContainer}>
                <Menu
                  visible={visible && activeCard === index}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={() => openMenu(index)} style={styles.options}>
                      <Text style={styles.cardTitle}>...</Text>
                    </TouchableOpacity>
                  }>
                  <Menu.Item onPress={() => pressDelete(index)} style={styles.deleteButton} title="Remove for me" />
                </Menu>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#DB504A',
    color: '#F4F4FC',
    borderRadius: 5,
    margin: -10,
  },
  card: {
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardCoverTasbeeh: {
    backgroundColor: '#8ebbff',
    height: 100,
    borderRadius: 0,
  },
  cardCoverKhatam: {
    backgroundColor: '#A98743',
    height: 100,
    borderRadius: 0,
  },
  cardCoverNotFound: {
    backgroundColor: '#db504a',
    height: 100,
    borderRadius: 0,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
    backgroundColor: '#2f3855',
  },
  cardTitle: {
    color: '#f4f4fc',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  options: {
    margin: 10,
    alignSelf: 'flex-end',
  },
});

export default CardComponent;

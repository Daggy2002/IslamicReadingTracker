import React, { useState, useEffect } from 'react';
import { Card, Text, Menu, IconButton } from 'react-native-paper';
import { View, TouchableOpacity, StyleSheet, Share} from 'react-native';

const CardComponent = ({ onClick, pressDelete, cardData, codes }) => {
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [codeData, setCodeData] = useState(cardData);

  useEffect(() => {
    setCodeData(cardData);
  }, [cardData]);

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

  const shareData = async (index) => {
    try {
      await Share.share({
        message:
          "Join the Khatam/Tasbeeh Reading using this code " +
          JSON.stringify(codes[index]),
      });
    } catch (error) {
      alert(error.message);
    }
  };
  const getTitle = (index) => {
    if(cardData[index].title){
      return cardData[index].title
    }else if(cardData[index].type === "QadhaSalaah"){
      return "Qadha Salaah"
    }else{
      return "Not Found"
    }
  }

  return (
    <>
      {codeData && codeData.map((code, index) => (
        <TouchableOpacity key={index} onPress={() => onClick(index)}>
          <Card style={styles.card}>
            <Card.Cover style={getStyle(index)} />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>{getTitle(index)}</Text>
              <View style={styles.optionsContainer}>
                <Menu
                  visible={visible && activeCard === index}
                  onDismiss={closeMenu}
                  anchor={
                    <IconButton
                      icon="dots-horizontal"
                      iconColor='#f4f4fc'
                      size={25}
                      onPress={() => openMenu(index)}
                    />
                  }>
                  <Menu.Item onPress={() => pressDelete(index)} color="red" title="Remove for me" />
                  <Menu.Item onPress={() => shareData(index)}  title="Share Code" />
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

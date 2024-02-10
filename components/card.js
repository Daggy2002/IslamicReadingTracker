import React, { useState, useEffect } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native';

const CardComponent = ({ onClick, pressDelete, cardData, codes }) => {
  const [visible, setVisible] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [codeData, setCodeData] = useState(cardData);

  useEffect(() => {
    setCodeData(cardData);
  }, [cardData]);

  const toggleMenu = (index) => {
    if (visible === index) {
      setVisible(null);
      setActiveCard(null);
    } else {
      setVisible(index);
      setActiveCard(index);
    }
  };

  const getStyle = (index) => {
    console.log(cardData[index].type);
    switch (cardData[index].type) {
      case 'Khatam':
        return styles.cardCoverKhatam;
      case 'Tasbeeh':
        return styles.cardCoverTasbeeh;
      case 'QadhaSalaah':
        return styles.cardCoverNotFound;
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
    if (cardData[index].title) {
      return truncateTitle(index);
    } else if (cardData[index].type === 'QadhaSalaah') {
      return 'Qadha Salaah';
    } else {
      return 'Not Found';
    }
  };

  const truncateTitle = (index) => {
    if (cardData[index].title.length > 14) {
      return cardData[index].title.substring(0, 14) + "...";
    }
    return cardData[index].title;
  };

  return (
    <>
      {codeData &&
        codeData.map((code, index) => (
          <TouchableOpacity key={index} onPress={() => onClick(index)}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardTitle}>{getTitle(index)}</Text>
                <View style={styles.optionsContainer}>
                  {visible === index ? (
                    <View style={styles.iconContainer}>

                      <IconButton
                        icon="delete"
                        iconColor="#db504a"
                        size={25}
                        onPress={() => {
                          pressDelete(index);
                          toggleMenu(index);
                        }}
                      />
                      <IconButton
                        icon="share-variant"
                        iconColor="#00BCD4"
                        size={25}
                        onPress={() => {
                          shareData(index);
                        }}
                      />
                      <IconButton
                        icon="dots-horizontal"
                        iconColor="#f4f4fc"
                        size={25}
                        onPress={() => toggleMenu(index)}
                      />
                    </View>
                  ) : (
                    <IconButton
                      icon="dots-horizontal"
                      iconColor='#f4f4fc'
                      size={25}
                      onPress={() => toggleMenu(index)}
                    />
                  )}
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardComponent;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Share,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Toast,
  Dialog,
  ALERT_TYPE,
} from "react-native-alert-notification";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import DropdownAlert, {
  DropdownAlertType,
} from "react-native-dropdownalert";
import { router } from "expo-router";
import Modal from "react-native-modal";

import db from "../firebase";
import AdditionalCirclesLegend from "./CircleDescription";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

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
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.circle, { backgroundColor: color }, animatedStyle]}
      >
        <Text style={styles.number}>{number}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CirclesGrid = ({ data, username, code }) => {
  const [circleColors, setCircleColors] = useState(Array(30).fill("#f4f4fc"));
  const [hasChanges, setHasChanges] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);


  const shareData = async () => {
    try {
      await Share.share({
        message:
          "Join the Khatam/Tasbeeh Reading using this code " +
          JSON.stringify(code),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteRoomConfirmation = () => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Delete Room",
      textBody: "Are you sure you want to delete this room?",
      button: "Delete",
      onPressButton: () => deleteRoom(),
    });
  };

  const deleteRoom = async () => {
    Dialog.hide();
    try {
      const codesCollection = collection(db, "Codes");
      await deleteDoc(doc(codesCollection, code));

      const codes = await AsyncStorage.getItem("codes");
      const codesArray = JSON.parse(codes);
      const index = codesArray.indexOf(code);
      codesArray.splice(index, 1);
      await AsyncStorage.setItem("codes", JSON.stringify(codesArray));
      router.replace("/Home");
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  useEffect(() => {
    //Check if all the circles are read
    setAllRead(data.data.every((item) => item.status === "read"));
  }, [data]);

  useEffect(() => {
    // Update circle colors based on data from prop
    const newColors = Object.values(data.data).map(({ status, name }) => {
      if (status === "none") return "#f4f4fc";
      if (status === "read") return "#9fcc2e";
      if (status === "assigned" && name === username) return "#8ebbff";
      return "#2F3855";
    });
    setCircleColors(newColors);
  }, [data]);

  const handlePress = (index) => {
    const color = circleColors[index];
    // Check if the color is clickable
    if (
      color === "#f4f4fc" ||
      (color === "#9fcc2e" && data.creator === username) ||
      color === "#8ebbff"
    ) {
      setCircleColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = color === "#8ebbff" ? "#f4f4fc" : "#8ebbff";
        setHasChanges(true);
        updateData(index, newColors); // Pass the updated colors to updateData
        return newColors;
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This para has already been taken by someone else",
      });
    }
  };

  const handleLongPress = (index) => {
    const color = circleColors[index];
    // Check if the color is clickable
    if (
      color === "#f4f4fc" ||
      (color === "#9fcc2e" && data.data[index].name === username) ||
      color === "#8ebbff"
    ) {
      setCircleColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = color === "#9fcc2e" ? "#f4f4fc" : "#9fcc2e";
        setHasChanges(true);
        updateData(index, newColors); // Pass the updated colors to updateData
        return newColors;
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This para has already been taken by someone else",
      });
    }
  };

  const updateData = (index, newColors) => {
    const newData = { ...data };
    const color = newColors[index]; // Use the updated colors array
    let status = "none";

    if (color === "#f4f4fc") {
      status = "none";
    } else if (color === "#373739" || color === "#9fcc2e") {
      status = "read";
    } else if (color === "#8ebbff" || color === "#8ebbff") {
      status = "assigned";
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
    const code1DocRef = doc(db, "Codes", code);

    try {
      // Fetch the current data of the document
      const docSnapshot = await getDoc(code1DocRef);

      // Update the data based on your requirements
      const updatedData = data;
      setAllRead(updatedData.data.every((item) => item.status === "read"));
      // Update the document with the new data
      await updateDoc(code1DocRef, updatedData);

      const alertData = await alert({
        type: DropdownAlertType.Success,
        title: "Success",
        message: "Selection saved successfully.",
      });
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: "Error saving selection. Please try again.",
      });
    }
  };

  const truncateTitle = () => {
    if (data.title.length > 14) {
      return data.title.substring(0, 14) + "...";
    }
    return data.title;
  };

  return (
    <>
    <Modal
      isVisible={isInfoVisible}
      onBackdropPress={() => setIsInfoVisible(false)}
    >
      <View style={styles.infoScreen}>
        <Text style={styles.heading}>
          🌟 How to use the khatam page 🌟
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>1. Tap or Press and Hold:</Text>{" "}
          Interact with circles by tapping or holding, just like pressing a button or holding a key.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>2. Switch Circle Colors:</Text>{" "}
          Tap or hold a circle to change its color. Experiment with colors; we've got your back if something goes wrong!
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>3. Save Your Selection:</Text>{" "}
          Make changes, tap "Save Selection," and your choices are saved – it's that easy.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>4. Delete the Room:</Text>{" "}
          If you created the page, find the delete button. Use it carefully, only if you're sure about deleting everything.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>5. Share the Code:</Text>{" "}
          Press the sharing icon to send a special code for others to join in.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>6. Complete Message:</Text>{" "}
          Once everyone finishes, a special message signals task completion.
        </Text>
      </View>
    </Modal>
      <DropdownAlert alert={(func) => (alert = func)} />
      <View style={styles.headingContainer}>
        <View>
          <Text style={styles.titleText}>{truncateTitle()}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <IconButton
            icon="share-variant"
            onPress={shareData}
            style={styles.shareButton}
          />

          {username === data.creator && (
            <IconButton
              icon="delete"
              onPress={deleteRoomConfirmation}
              style={styles.deleteButton}
            />
          )}
          <IconButton
            icon="information"
            onPress={() => setIsInfoVisible(true)}
            style={styles.infoButton}
          />
        </View>
      </View>
      {allRead ? (
        <View>
          <Text style={styles.completeMessage}>
            The Khatam is complete, Jazakallah Khair for participating
          </Text>
          <Image
            style={styles.image}
            source={require("../assets/complete.png")}
          />
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
          <Text style={styles.description}>
            You can quickly tap or press and hold to switch the circle colors.
          </Text>
          {hasChanges && (
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              color="#2faa4b"
            >
              Save Selection
            </Button>
          )}
          {/* Conditionally render the AdditionalCirclesLegend */}
          {!hasChanges && <AdditionalCirclesLegend />}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    width: "70%",
    alignSelf: "center",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#2faa4b",
  },
  completeMessage: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
    color: "#9FCC2E",
  },
  buttonText: {
    color: "#f4f4fc",
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    color: "#f4f4fc",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    margin: 15,
    color: "#f4f4fc",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  circleContainer: {
    width: "17%",
    alignItems: "center",
    margin: 2,
    padding: 2,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
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
    alignSelf: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  shareButton: {
    backgroundColor: "#8EBBFF",
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#DB504A",
    borderRadius: 5,
  },
  infoButton: {
    backgroundColor: "#f4f4fc",
    borderRadius: 5,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "#c0c2ce",
  },
  infoScreen: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default CirclesGrid;

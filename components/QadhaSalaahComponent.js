// Give me the basic layout of a component
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { ProgressBar, IconButton, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import DropdownAlert, { DropdownAlertType } from "react-native-dropdownalert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  AlertNotificationRoot,
  Dialog,
  ALERT_TYPE,
} from "react-native-alert-notification";
import Modal from "react-native-modal";

import db from "../firebase";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

const QadhaSalaahComponent = ({ data, code }) => {
  const salaahNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const [isRead, setIsRead] = useState(data.data.salaahsRead);
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const fadeAnim = new Animated.Value(0); // Initialize fade animation value
  const [goalReached, setGoalReached] = useState(false);

  useEffect(() => {
    // Use effect to trigger fade in/out animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // After fade in, start fade out
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }, [allRead]);

  useEffect(() => {
    setGoalReached(data.data.current_amount >= data.data.goal);
  }, [data]);

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

  const saveChanges = async () => {
    setShowSaveChanges(false);

    if (isRead.every((val) => val === true)) {
      setIsRead([false, false, false, false, false]);
      data.data.current_amount = data.data.current_amount + 1;
      setAllRead(true);
      //After 2 seconds set allRead to false
      setTimeout(() => {
        setAllRead(false);
      }, 2000);
      data.data.salaahsRead = [false, false, false, false, false];
    } else {
      data.data.salaahsRead = isRead;
    }

    const codeDocRef = doc(db, "Codes", code);

    try {
      // Fetch the current data of the document
      const docSnapshot = await getDoc(codeDocRef);

      // Update the data based on your requirements
      const updatedData = data;
      setGoalReached(updatedData.data.current_amount >= updatedData.data.goal);
      // Update the document with the new data
      await updateDoc(codeDocRef, updatedData);

      const alertData = await alert({
        type: DropdownAlertType.Success,
        message: "Your selection has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving selection:", error);
    }
  };

  const handleCheckBoxChange = (index) => {
    // Create a new array with the updated isRead value for the clicked index
    const updatedIsRead = [...isRead];
    updatedIsRead[index] = !updatedIsRead[index];
    setIsRead(updatedIsRead);
    setShowSaveChanges(true);
  };

  return (
    <>
      <AlertNotificationRoot>
        <Modal
          isVisible={isInfoVisible}
          onBackdropPress={() => setIsInfoVisible(false)}
        >
          <View style={styles.infoScreen}>
            <Text style={styles.heading}>
              How to use the Qadha Salaah Tracker
            </Text>

            <Text style={styles.infoText}>
              1. <Text style={styles.boldText}>Checking Salaahs:</Text> Mark the
              salaahs you've read by tapping on the checklist icon.
            </Text>

            <Text style={styles.infoText}>
              2. <Text style={styles.boldText}>Counting Completed Days:</Text>{" "}
              Once you've marked all salaahs as complete, your 'Days Read' count
              goes up by 1, and the salaahs are reset for the next day.
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.boldText}>4. Delete the Room:</Text> Click on
              the trash icon to delete your room.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsInfoVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <DropdownAlert alert={(func) => (alert = func)} />

        <View style={styles.headingContainer}>
          <View>
            <Text style={styles.titleText}>Qadha Salaah Tracker</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <IconButton
              icon="delete"
              onPress={deleteRoomConfirmation}
              iconColor="#DB504A"
            />

            <IconButton
              icon="information"
              onPress={() => setIsInfoVisible(true)}
              iconColor="#f4f4fc"
            />
          </View>
        </View>

        {goalReached ? (
          <View>
            <Text style={styles.completeMessage}>
              You have read all your Qadha Salaahs! {"\n"}
              ٱلْحَمْدُ لِلّٰه {"\n"} رَبَّنَا تَقَبَّلۡ مِنَّآۖ
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.subheading}>
              Qadha Salaahs Read: {data.data.current_amount} / {data.data.goal}
            </Text>
            <ProgressBar
              progress={data.data.current_amount / data.data.goal}
              color={"#8EBBFF"}
              style={styles.progressBar}
            />

            {salaahNames.map((salaah, index) => (
              <View key={index} style={styles.salaahContainer}>
                <Checkbox
                  status={isRead[index] ? "checked" : "unchecked"}
                  onPress={() => handleCheckBoxChange(index)}
                  style={styles.checkBox}
                  color="#8EBBFF"
                />
                <Text style={styles.salaahName}>{salaah}</Text>
              </View>
            ))}
            {allRead && (
              <Animated.Text
                style={{ ...styles.completion, opacity: fadeAnim }}
              >
                You've read one day of Qadha Salaah
              </Animated.Text>
            )}

            {showSaveChanges && (
              <TouchableOpacity
                onPress={saveChanges}
                style={styles.saveChangesButton}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.text}>
              Click the <Icon name="info" size={20} style={styles.icon} /> to
              view detailed instructions on how to use this page
            </Text>
          </>
        )}
      </AlertNotificationRoot>
    </>
  );
};

const styles = StyleSheet.create({
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
  subheading: {
    textAlign: "center",
    color: "#8EBBFF",
  },
  progressBar: {
    margin: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2f3855",
  },
  saveChangesButton: {
    backgroundColor: "#8EBBFF",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  salaahContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  salaahName: {
    fontSize: 18,
    color: "#c0c2ce",
    marginRight: 10,
  },
  checkBox: {
    margin: 5,
    padding: 10,
  },
  completion: {
    textAlign: "center",
    color: "#8EBBFF",
    fontSize: 18,
    margin: 10,
  },
  infoScreen: {
    backgroundColor: "#222b3d",
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
    color: "#f4f4fc",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#f4f4fc",
  },
  boldText: {
    fontWeight: "bold",
    color: "#f4f4fc",
  },
  text: {
    padding: 10,
    fontSize: 15,
    margin: 15,
    textAlign: "center",
    color: "#f4f4fc",
    fontWeight: "bold",
  },
  icon: {
    margin: 10,
    color: "#8ebbff",
  },
  closeButton: {
    backgroundColor: "#DB504A",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#F4F4FC",
    fontSize: 16,
  },
  image: {
    alignSelf: "center",
  },
  completeMessage: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
    color: "#9FCC2E",
  },
});

export default QadhaSalaahComponent;

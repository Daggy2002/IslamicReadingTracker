import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Share,
} from "react-native";
import { ProgressBar, IconButton } from "react-native-paper";
import { Toast, Dialog, ALERT_TYPE, AlertNotificationRoot } from "react-native-alert-notification";
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
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";

import db from "../firebase";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

const NumericStepper = ({ data, code }) => {
  const [value, setValue] = useState(data.data.current_amount);
  const [originalValue, setOriginalValue] = useState(data.data.current_amount);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const step = 1;

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
    // Update the state when the data prop changes
    setValue(data.data.current_amount);
    setOriginalValue(data.data.current_amount);
    setShowConfirmButton(false);
    setGoalReached(data.data.current_amount >= data.data.goal);
  }, [data]);

  const increment = () => {
    setValue(value + step);
    setShowConfirmButton(true);
  };

  const decrement = () => {
    if (value > 0) {
      setValue(value - step);
      setShowConfirmButton(true);
    }
  };
  const confirmChange = async () => {
    setOriginalValue(value);
    setShowConfirmButton(false);

    data.data.current_amount = value;

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
      const alertData = alert({
        type: DropdownAlertType.Warn,
        message: "Error saving your selection. Please try again.",
      });
    }
  };

  const cancelChange = () => {
    setValue(originalValue);
    setShowConfirmButton(false);
  };

  const truncateTitle = () => {
    if (data.title.length > 12) {
      return data.title.substring(0, 12) + "...";
    }
    return data.title;
  };

  return (
    <>
      <AlertNotificationRoot>
      <Modal
        isVisible={isInfoVisible}
        onBackdropPress={() => setIsInfoVisible(false)}
      >
        <View style={styles.infoScreen}>
          <Text style={styles.heading}>How to use the page</Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>1.Viewing Progress:</Text>
            The top section shows the goal and your current progress. If the
            progress bar is filled, congratulations! You've reached the goal.
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.boldText}>2.Adjusting Your Count:</Text>
            Use the "+" and "-" buttons to increase or decrease the count.
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.boldText}>3. Save Your Selection:</Text> Make
            changes then tap "Save Selection".
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
          <Text style={styles.titleText}>{truncateTitle()}</Text>
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
            You have kept all your Qadha fasts! {"\n"}
            ٱلْحَمْدُ لِلّٰه {"\n"}  رَبَّنَا تَقَبَّلۡ مِنَّآۖ
          </Text>

        </View>
      ) : (
        <>
          <Text style={styles.headingText}>Goal: {data.data.goal}</Text>
          <Text variant="titleLarge" style={styles.subheading}>
            {value}/{data.data.goal}
          </Text>
          <ProgressBar
            progress={value/ data.data.goal}
            color="#8ebbff"
            style={styles.progressBar}
          />
          <View style={styles.container}>
            <TouchableOpacity onPress={() => decrement()} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{value}</Text>
            <TouchableOpacity onPress={() => increment()} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          {showConfirmButton && (
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                onPress={confirmChange}
                style={styles.confirmButton}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelChange}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.text}>
            Click the <Icon name="info" size={20} style={styles.icon} /> to view
            detailed instructions on how to use this page
          </Text>
        </>
      )}
      </AlertNotificationRoot>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    backgroundColor: "#2f3855",
    borderRadius: 5,
    width: 30,
    alignItems: "center",
  },
  largeButton: {
    padding: 10,
    backgroundColor: "#8ebbff",
    borderRadius: 5,
    width: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    color: "#f4f4fc",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "#c0c2ce",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
    color: "#8ebbff",
  },
  subheading: {
    textAlign: "center",
    color: "#f4f4fc",
  },
  progressBar: {
    margin: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2f3855",
  },
  confirmButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  completeMessage: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
    color: "#9FCC2E",
  },
  mainContainer: {
    margin: 20,
    alignContent: "center",
  },
  image: {
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
});

export default NumericStepper;

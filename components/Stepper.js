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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Modal from "react-native-modal";

import db from "../firebase";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

const NumericStepper = ({ data, code, username }) => {
  const [value, setValue] = useState(data.data.current_amount);
  const [originalValue, setOriginalValue] = useState(data.data.current_amount);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const step = 10;
  const largeStep = 100;

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
    // Update the state when the data prop changes
    setValue(data.data.current_amount);
    setOriginalValue(data.data.current_amount);
    setShowConfirmButton(false);
    setGoalReached(data.data.current_amount >= data.data.goal);
  }, [data]);

  const increment = (isLargeStep = false) => {
    setValue(value + (isLargeStep ? largeStep : step));
    setShowConfirmButton(true);
  };

  const decrement = (isLargeStep = false) => {
    if (value > 0) {
      setValue(value - (isLargeStep ? largeStep : step));
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
        title: "Success",
        message: "Selection saved successfully.",
      });
    } catch (error) {
      console.error("Error saving selection:", error);

      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: "Error saving selection. Please try again.",
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
      <Modal
        isVisible={isInfoVisible}
        onBackdropPress={() => setIsInfoVisible(false)}
      >
        <View style={styles.infoScreen}>
          <Text style={styles.heading}>📊 Viewing Progress:</Text>
          <Text style={styles.infoText}>
            - The top section shows the goal and your current progress.
          </Text>
          <Text style={styles.infoText}>
            - If the progress bar is filled, congratulations! You've reached the
            goal.
          </Text>

          <Text style={styles.heading}>🔄 Adjusting Count:</Text>
          <Text style={styles.infoText}>
            - Use the "+" and "-" buttons to increase or decrease the count.
          </Text>
          <Text style={styles.infoText}>
            - For larger changes, try the "++" and "--" buttons.
          </Text>

          <Text style={styles.heading}>✔ Confirm Changes:</Text>
          <Text style={styles.infoText}>
            - If you're satisfied with the count, press "Confirm" below the
            buttons.
          </Text>

          <Text style={styles.heading}>📤 Sharing:</Text>
          <Text style={styles.infoText}>
            - Use the "Share" button to invite others using the given code.
          </Text>

          <Text style={styles.heading}>❌ Deleting Room (Creator Only):</Text>
          <Text style={styles.infoText}>
            - If you're the creator, press "Delete" to remove the room
            (confirmation required).
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
            iconColor="#8EBBFF"
          />

          {username === data.creator && (
            <IconButton
              icon="delete"
              onPress={deleteRoomConfirmation}
              iconColor="#DB504A"
            />
          )}
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
            The Tasbeeh Reading is complete, Jazakallah Khair for participating
          </Text>
          <Image
            style={styles.image}
            source={require("../assets/complete.png")}
          />
        </View>
      ) : (
        <>
          <Text style={styles.headingText}>Goal: {data.data.goal}</Text>
          <Text variant="titleLarge" style={styles.subheading}>
            {value}/{data.data.goal}
          </Text>
          <ProgressBar
            progress={data.data.current_amount / data.data.goal}
            color="#8ebbff"
            style={styles.progressBar}
          />
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => decrement(true)}
              style={styles.largeButton}
            >
              <Text style={styles.buttonText}>--</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => decrement()} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{value}</Text>
            <TouchableOpacity onPress={() => increment()} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => increment(true)}
              style={styles.largeButton}
            >
              <Text style={styles.buttonText}>++</Text>
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
        </>
      )}
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
});

export default NumericStepper;

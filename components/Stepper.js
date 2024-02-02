import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import { ProgressBar } from "react-native-paper";
import {
  AlertNotificationRoot,
  Toast,
  Dialog,
  ALERT_TYPE,
} from "react-native-alert-notification";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore/lite";

import db from "../firebase";

const NumericStepper = ({ data, code }) => {
  const [value, setValue] = useState(data.data.current_amount);
  const [originalValue, setOriginalValue] = useState(data.data.current_amount);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [goalReached, setGoalReached] = useState(false);

  const step = 50;
  const largeStep = 100;

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
    // Get the reference to the 'Code1' document
    const codeDocRef = doc(db, "Codes", code);

    try {
      // Fetch the current data of the document
      const docSnapshot = await getDoc(codeDocRef);

      // Update the data based on your requirements
      const updatedData = data;
      setGoalReached(updatedData.data.current_amount >= updatedData.data.goal);
      // Update the document with the new data
      await updateDoc(codeDocRef, updatedData);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Selection saved successfully!",
        autoClose: 2000,
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

  return (
    <AlertNotificationRoot>
      <View style={styles.mainContainer}>
        {goalReached ? (
          <View>
            <Text style={styles.completeMessage}>
              The Tasbeeh Reading is complete, thanks for participating
            </Text>
            <Image
              style={styles.image}
              source={require("../assets/complete.png")}
            />
          </View>
        ) : (
          <>
            <Text style={styles.titleText}>{data.title}</Text>
            <Text style={styles.headingText}>Goal: {data.data.goal}</Text>
            <Text variant="titleLarge" style={styles.subheading}>
              {value}/{data.data.goal}
            </Text>
            <ProgressBar
              progress={value / data.data.goal}
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
              <TouchableOpacity
                onPress={() => decrement()}
                style={styles.button}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.value}>{value}</Text>
              <TouchableOpacity
                onPress={() => increment()}
                style={styles.button}
              >
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
      </View>
    </AlertNotificationRoot>
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
    textAlign: "center",
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
    alignSelf: 'center',
  },
});

export default NumericStepper;

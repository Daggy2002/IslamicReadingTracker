// Give me the basic layout of a component
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ProgressBar, IconButton } from "react-native-paper";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from "react-native-dropdownalert";
import ConfettiCannon from 'react-native-confetti-cannon';

import db from "../firebase";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

const QadhaSalaahComponent = ({ data, username, code }) => {
  const salaahNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const [isRead, setIsRead] = useState(data.data.salaahsRead);
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [allRead, setAllRead] = useState(false);

  const truncateTitle = () => {
    if (data.title.length > 14) {
      return data.title.substring(0, 14) + "...";
    }
    return data.title;
  };
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

  const saveChanges = async () => {
    console.log(isRead);
    for (let i = 0; i < isRead.length; i++) {
      if (!isRead[i]) {
        console.log(isRead[i]);
        setAllRead(false);
        break;
      }else{
        setAllRead(true);
      }
    }
    if (allRead) {
      data.data.current_amount += 1;

      //Change all the stuff in isRead to false
      let newIsRead = [false, false, false, false, false];
      setIsRead(newIsRead);
    }
    setShowSaveChanges(false);
    data.data.salaahsRead = isRead;

    const codeDocRef = doc(db, "Codes", code);

    try {
      // Fetch the current data of the document
      const docSnapshot = await getDoc(codeDocRef);

      // Update the data based on your requirements
      const updatedData = data;

      // Update the document with the new data
      await updateDoc(codeDocRef, updatedData);

      const alertData = await alert({
        type: DropdownAlertType.Success,
        title: "Success",
        message: "Selection saved successfully.",
      });
    } catch (error) {
      console.error("Error saving selection:", error);
    }
    setAllRead(false);
  };

  return (
    <>
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
      <Text style={styles.subheading}>Qadha Salaahs Read: {data.data.current_amount} / {data.data.goal}</Text>
      <ProgressBar
        progress={data.data.current_amount / data.data.goal}
        color={"#8EBBFF"}
        style={styles.progressBar}
      />

      {(allRead && <ConfettiCannon count={200} origin={{x: -10, y: 0}} fadeOut="true"/>)}
      
      {isRead.map((isChecked, index) => (
        <BouncyCheckbox
          style={styles.checkBoxes}
          key={index}
          size={25}
          text={salaahNames[index]}
          isChecked={isChecked}
          onPress={() => {
            const updatedIsRead = [...isRead];
            updatedIsRead[index] = !isChecked;
            setIsRead(updatedIsRead);
            setShowSaveChanges(true);
          }}
        />
      ))}
      {showSaveChanges && (
        <TouchableOpacity
          onPress={saveChanges}
          style={styles.saveChangesButton}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
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
  checkBoxes: {
    margin: 10,
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
});

export default QadhaSalaahComponent;

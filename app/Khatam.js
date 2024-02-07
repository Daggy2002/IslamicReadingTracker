import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Share,
  RefreshControl,
  ScrollView,
  View,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";
import Loader from "giant.panda_react-native-three-dots-loader";
import CirclesGrid from "../components/CirclesGrid";
import db from "../firebase";
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from "react-native-alert-notification";

export default function Khatam() {
  const [data, setData] = useState([]);
  const { code } = useLocalSearchParams();
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState("");

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

  const getCodes = async () => {
    const codesCollection = collection(db, "Codes");
    const codesQuery = query(codesCollection, where("__name__", "==", code));
    const querySnapshot = await getDocs(codesQuery);

    const doc = querySnapshot.docs.find((snapshot) => snapshot.id === code);
    if (doc) {
      setData(doc.data());
    }
    setIsDataRetrieved(true);
    setIsRefreshing(false); // Set refreshing to false after data retrieval
  };

  useEffect(() => {
    getCodes();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("username").then((value) => {
      setUsername(value);
    });
  }, []);

  //Show the dialog to confirm the deletion of the room
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getCodes();
  };

  return (
    <AlertNotificationRoot>
      {isDataRetrieved ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <CirclesGrid data={data} username={username} code={code} />
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Loader />
        </View>
      )}
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});

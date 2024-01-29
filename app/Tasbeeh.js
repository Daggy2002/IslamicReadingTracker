import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Share,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { Text } from "react-native-paper";
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

import {
  AlertNotificationRoot,
  Dialog,
  ALERT_TYPE,
} from "react-native-alert-notification";

import Stepper from "../components/Stepper";
import db from "../firebase";

export default function Tasbeeh() {
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
    try {
      const codesCollection = collection(db, "Codes");
      const codesQuery = query(codesCollection, where("__name__", "==", code));
      const querySnapshot = await getDocs(codesQuery);

      const doc = querySnapshot.docs.find((snapshot) => snapshot.id === code);
      if (doc) {
        setData(doc.data());
      }
      setIsDataRetrieved(true);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getCodes();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getCodes();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    AsyncStorage.getItem("username").then((value) => {
      setUsername(value);
    });
  }, []);

  return (
    <AlertNotificationRoot>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {isDataRetrieved ? (
          <>
            <Stepper data={data} code={code} />
            <TouchableOpacity onPress={shareData} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Code</Text>
            </TouchableOpacity>
            {username === data.creator ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteRoomConfirmation}
              >
                <Text style={styles.deleteButtonText}>Delete Room</Text>
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <View style={styles.container}>
            <Loader />
          </View>
        )}
      </ScrollView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "#8EBBFF",
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  shareButtonText: {
    color: "#F4F4FC",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#DB504A",
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  deleteButtonText: {
    color: "#F4F4FC",
    textAlign: "center",
  },
});

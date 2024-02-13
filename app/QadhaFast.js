import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import Loader from "giant.panda_react-native-three-dots-loader";

import {
  AlertNotificationRoot,
} from "react-native-alert-notification";

import Stepper from "../components/StepperFast";
import db from "../firebase";

export default function Tasbeeh() {
  const [data, setData] = useState([]);
  const { code } = useLocalSearchParams();
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState("");

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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getCodes();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getCodes();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("username").then((value) => {
      setUsername(value);
    });
  }, []);

  return (
      <>
      {isDataRetrieved ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Stepper data={data} code={code}/>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Loader />
        </View>
      )}
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#222b3d",
    alignItems: "center",
    justifyContent: "center",
  },
  tasbeehContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tasbeehPair: {
    width: "45%",
    marginVertical: 10,
  },
  tasbeehText: {
    fontSize: 18,
    textAlign: "center",
    color: "#f4f4fc",
  },
});

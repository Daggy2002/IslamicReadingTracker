import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Share,
  RefreshControl,
  ScrollView,
  View,
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
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from "react-native-alert-notification";

import CirclesGrid from "../components/CirclesGrid";
import db from "../firebase";


export default function Khatam() {
  const [data, setData] = useState([]);
  const { code } = useLocalSearchParams();
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState("");

  const getCodes = async () => {
    const codesCollection = collection(db, "Codes");
    const codesQuery = query(codesCollection, where("__name__", "==", code));
    const querySnapshot = await getDocs(codesQuery);

    const doc = querySnapshot.docs.find((snapshot) => snapshot.id === code);
    if (doc) {
      setData(doc.data());
    }
    setIsDataRetrieved(true);
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getCodes();
  };

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});

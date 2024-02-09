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

import Stepper from "../components/Stepper";
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
    <AlertNotificationRoot>
      {isDataRetrieved ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Stepper data={data} code={code} username={username}/>

          <View style={styles.tasbeehContainer}>
            <View style={styles.tasbeehPair}>
              <Text style={styles.tasbeehText}>Sub-ha-nal-lah</Text>
              <Text style={styles.tasbeehText}>سُبْحَانَ ٱللَّٰهِ</Text>
            </View>

            <View style={styles.tasbeehPair}>
              <Text style={styles.tasbeehText}>al-ham-du-lil-lah</Text>
              <Text style={styles.tasbeehText}>ٱلْحَمْدُ لِلَّٰهِ</Text>
            </View>

            <View style={styles.tasbeehPair}>
              <Text style={styles.tasbeehText}>Allah-hu-ak-bar</Text>
              <Text style={styles.tasbeehText}>اَللّٰهُ أَكْبَرُ</Text>
            </View>

            <View style={styles.tasbeehPair}>
              <Text style={styles.tasbeehText}>As-tag-fir-rul-lah</Text>
              <Text style={styles.tasbeehText}>أَسْتَغْفِرُ اللّٰه</Text>
            </View>
          </View>
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

import { View, StyleSheet, ScrollView, RefreshControl} from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { useLocalSearchParams } from "expo-router";
import Loader from "giant.panda_react-native-three-dots-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

import QadhaSalaahComponent from "../components/QadhaSalaahComponent";
import db from "../firebase";

export default function QadhaSalaah() {
  const [data, setData] = useState([]);
  const { code } = useLocalSearchParams();
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          <QadhaSalaahComponent data={data} code={code} />
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

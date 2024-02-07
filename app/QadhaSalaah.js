import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";

import QadhaSalaahComponent from "../components/QadhaSalaahComponent";
import db from "../firebase";

const getCodes = async () => {
  const codesCollection = collection(db, "Codes");
  const codesQuery = query(
    codesCollection,
    where("__name__", "==", "S3RP148Z")
  );
  const querySnapshot = await getDocs(codesQuery);

  const doc = querySnapshot.docs.find((snapshot) => snapshot.id === "S3RP148Z");
  if (doc) {
  }
};

const data = {
  creator: "Tester001",
  data: {
    current_amount: 270,
    goal: "1000",
    salaahsRead: [true, true, false, true, true],
  },
  title: "New reading ",
  type: "QadhaSalaah",
};

export default function QadhaSalaah() {
  useEffect(() => {
    getCodes();
  }, []);
  return (
    <>
      <QadhaSalaahComponent code="S3RP148Z" data={data} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 18,
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { Provider as PaperProvider, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import { router } from "expo-router";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Linking } from "react-native";
import Loader from "giant.panda_react-native-three-dots-loader";

import CardComponent from "../components/card";
import Add from "../components/Add";
import ModalPopup from "../components/modal";
import db from "../firebase";



const generateRandomCode = () => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  const codeLength = 8;

  while (code.length < codeLength) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const character = characters.charAt(randomIndex);

    // Check if the character is not already in the code
    if (code.indexOf(character) === -1) {
      code += character;
    }
  }

  return code;
};

export default function Home() {
  const [codes, setCodes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalToggle, setModalToggle] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [dataRetrieved, setDataRetrieved] = useState(false);

  const createKhatam = async (titleInput) => {
    const code = generateRandomCode();

    //Get the username from async storage
    const username = await AsyncStorage.getItem("username");

    const data = {
      creator: username,
      data: [
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
        { name: "none", status: "none" },
      ],
      title: titleInput,
      type: "Khatam",
    };
    try {
      const codesCollection = collection(db, "Codes");

      await setDoc(doc(codesCollection, code), data);
    } catch (error) {
      console.log(error);
    }

    const newCodes = [...codes, code];
    setCodes(newCodes);
    await AsyncStorage.setItem("codes", JSON.stringify(newCodes));
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Code created successfully",
    });

    closeModal();
    onRefresh();

    //Give it a 2 second delay
    setTimeout(() => {
      router.push({
        pathname: "/Khatam",
        params: { code: code },
      });
    }, 2000);
  };

  const createTasbeeh = async (titleInput, goal) => {
    const code = generateRandomCode();

    //Get the username from async storage
    const username = await AsyncStorage.getItem("username");

    const data = {
      creator: username,
      data: { current_amount: 0, goal: goal },
      title: titleInput,
      type: "Tasbeeh",
    };

    try {
      const codesCollection = collection(db, "Codes");

      await setDoc(doc(codesCollection, code), data);
    } catch (error) {
      console.log(error);
    }

    const newCodes = [...codes, code];
    setCodes(newCodes);
    await AsyncStorage.setItem("codes", JSON.stringify(newCodes));
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Code created successfully",
    });

    closeModal();
    onRefresh();

    //Give it a 2 second delay
    setTimeout(() => {
      router.push({
        pathname: "/Tasbeeh",
        params: { code: code },
      });
    }, 2000);
  };

  const addCode = async (codeInput) => {
    // First check if the code is already been added
    if (codes.includes(codeInput)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This code has already been added",
      });
      return;
    }

    // Check if the code exists in the database
    const codesCollection = collection(db, "Codes");
    const codesQuery = query(
      codesCollection,
      where("__name__", "==", codeInput)
    );
    const querySnapshot = await getDocs(codesQuery);

    if (querySnapshot.empty) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "This code does not exist",
        textBody: "Please enter a valid code",
      });
    } else {
      getCodes();
      closeModal();
      const data = querySnapshot.docs[0].data();
      const newCodes = [...codes, codeInput];
      setCodes(newCodes);
      await AsyncStorage.setItem("codes", JSON.stringify(newCodes));
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Code added successfully",
      });
      Toast.hide();
      onRefresh();
      //Give it a 2 second delay
      setTimeout(() => {
        if (data.type === "Khatam") {
          router.push({
            pathname: "/Khatam",
            params: { code: codeInput },
          });
        } else {
          router.push({
            pathname: "/Tasbeeh",
            params: { code: codeInput },
          });
        }
      }, 2000);
    }
  };

  const pressDelete = (index) => {
    const newCodes = [...codes];
    newCodes.splice(index, 1);
    setCodes(newCodes);
    AsyncStorage.setItem("codes", JSON.stringify(newCodes));
    onRefresh();
  };

  const getCodes = async () => {
    const value = await AsyncStorage.getItem("codes");
    const parsedCodes = JSON.parse(value) || [];
    setCodes(parsedCodes);

    //First check if the codes array is empty
    if (parsedCodes.length === 0) {
      setCardData([]);
      setDataRetrieved(true);
      return;
    }

    // Firestore query to get documents where the document ID is in the codes array
    const codesCollection = collection(db, "Codes");
    const codesQuery = query(
      codesCollection,
      where("__name__", "in", parsedCodes)
    );
    const querySnapshot = await getDocs(codesQuery);

    const matchedDocs = [];
    parsedCodes.forEach((code) => {
      const doc = querySnapshot.docs.find((snapshot) => snapshot.id === code);

      if (doc) {
        matchedDocs.push(doc.data());
      } else {
        // If no matching document found, push None
        matchedDocs.push("None");
      }
    });

    setCardData(matchedDocs);
    setDataRetrieved(true);
  };

  const onCardPress = (index) => {
    if (cardData[index].type === "Khatam") {
      router.push({
        pathname: "/Khatam",
        params: { code: codes[index] },
      });
    } else if (cardData[index].type === "Tasbeeh") {
      router.push({
        pathname: "/Tasbeeh",
        params: { code: codes[index] },
      });
    } else {
      router.push({
        pathname: "/CompleteOrMissing",
      });
    }
  };

  useEffect(() => {
    getCodes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setDataRetrieved(false);
    await getCodes();
    setRefreshing(false);
  };

  const openModal = () => {
    setModalToggle(true);
  };

  const closeModal = () => {
    setModalToggle(false);
  };

  const handleDonationClick = () => {
    Linking.openURL(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmNpayByb2xs"
    );
  };

  return (
    <>
      <GestureHandlerRootView>
        <TouchableOpacity onPress={handleDonationClick}>
          <Text style={styles.text}>
            If you liked the app, consider leaving a donation
          </Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
      {dataRetrieved ? (
        <PaperProvider>
          <AlertNotificationRoot theme="dark">
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <CardComponent
                onClick={onCardPress}
                Title={"Quraan Khatam"}
                pressDelete={pressDelete}
                cardData={cardData}
              />
            </ScrollView>
            <ModalPopup
              visible={modalToggle}
              onClose={closeModal}
              saveCode={addCode}
              createKhatam={createKhatam}
              createTasbeeh={createTasbeeh}
            />
          </AlertNotificationRoot>
        </PaperProvider>
      ) : (
        <View style={styles.container}>
          <Loader />
        </View>
      )}
      <Add onclick={openModal} />
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
  text: {
    padding: 10,
    fontSize: 15,
    margin: 15,
    textAlign: "center",
    color: "#f4f4fc",
    fontWeight: "bold",
  },
});

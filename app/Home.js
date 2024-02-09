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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Linking } from "react-native";
import Loader from "giant.panda_react-native-three-dots-loader";
import DropdownAlert, { DropdownAlertType } from "react-native-dropdownalert";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import CardComponent from "../components/card";
import Add from "../components/Add";
import ModalPopup from "../components/MainMenu";
import db from "../firebase";
import { AD_MOB_ID } from "@env";

let alert = (DropdownAlertData) =>
  new Promise() < DropdownAlertData > ((res) => res);

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : AD_MOB_ID;

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

  const createNewRoom = async (type, titleInput, goal) => {
    //Verify the title
    if (type === "Khatam" || type === "Tasbeeh") {
      if (titleInput === "") {
        const alertData = await alert({
          type: DropdownAlertType.Warn,
          title: "Invalid Title",
          message: "Please enter a title",
        });
        return;
      }
    }

    //Verify the goal is valid
    if (type === "Tasbeeh" || type === "QadhaSalaah") {
      if (goal <= 0 || !Number.isInteger(Number(goal))) {
        const alertData = await alert({
          type: DropdownAlertType.Warn,
          title: "Invalid Number",
          message: "Please enter a positive integer for the goal",
        });
        return;
      }
    }

    const code = generateRandomCode();

    const username = await AsyncStorage.getItem("username");

    let data = {};

    switch (type) {
      case "Khatam":
        data = {
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
        break;
      case "Tasbeeh":
        data = {
          creator: username,
          data: { current_amount: 0, goal: goal },
          title: titleInput,
          type: "Tasbeeh",
        };
        break;
      case "QadhaSalaah":
        data = {
          creator: username,
          data: {
            current_amount: 0,
            goal: goal,
            salaahsRead: [false, false, false, false, false],
          },
          type: "QadhaSalaah",
        };
        break;
    }

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
        pathname: "/" + type,
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
      //Redirect
      setTimeout(() => {
        router.push({
          pathname: "/" + data.type,
          params: { code: codeInput },
        });
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
        matchedDocs.push("None");
      }
    });

    setCardData(matchedDocs);
    setDataRetrieved(true);
  };

  const onCardPress = (index) => {
    if (cardData[index].type) {
      router.push({
        pathname: "/" + cardData[index].type,
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

  return (
    <>
      <GestureHandlerRootView>
        <DropdownAlert alert={(func) => (alert = func)} />
        <BannerAd
          style={{ margin: 10 }}
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            networkExtras: {
              collapsible: "bottom",
            },
          }}
        />
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
                codes={codes}
              />
            </ScrollView>
            <ModalPopup
              visible={modalToggle}
              onClose={closeModal}
              saveCode={addCode}
              createNewRoom={createNewRoom}
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

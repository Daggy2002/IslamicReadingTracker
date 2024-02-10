import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from "react-native";

const ModalPopup = ({ visible, onClose, saveCode, createNewRoom }) => {
  const [createChosen, setCreateChosen] = useState(false);
  const [joinChosen, setJoinChosen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [khatamChosen, setKhatamChosen] = useState(false);
  const [tasbeehChosen, setTasbeehChosen] = useState(false);
  const [QadhaSalaahChosen, setQadhaSalaahChosen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [goal, setGoal] = useState(0);

  const resetStates = () => {
    setCreateChosen(false);
    setJoinChosen(false);
    setKhatamChosen(false);
    setTasbeehChosen(false);
    setQadhaSalaahChosen(false);
    setCodeInput("");
    setTitleInput("");
  };

  useEffect(() => {
    if (!visible) {
      resetStates();
    }
  }, [visible]);

  tasbeehOnClick = () => {
    setTasbeehChosen(true);
    setCreateChosen(false);
  };

  khatamOnClick = () => {
    setKhatamChosen(true);
    setCreateChosen(false);
  };

  qadhaSalaahOnClick = () => {
    setQadhaSalaahChosen(true);
    setCreateChosen(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {createChosen ? (
              <View>
                <Text style={styles.headingText}>Please select the type of room you would like to create</Text>
                <TouchableOpacity style={styles.button} onPress={khatamOnClick}>
                  <Text style={styles.buttonText}>Quraan Khatam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={tasbeehOnClick}
                >
                  <Text style={styles.buttonText}>Tasbeeh/Surah/Qadha fast Tracker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={qadhaSalaahOnClick}
                >
                  <Text style={styles.buttonText}>Qadha Salaah Tracker</Text>
                </TouchableOpacity>
              </View>
            ) : joinChosen ? (
              <View>
                <Text style={styles.headingText}>Please enter the code that was shared with you</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Code"
                  value={codeInput}
                  onChangeText={(text) => setCodeInput(text)}
                  placeholderTextColor={"#F4F4FC"}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => saveCode(codeInput)}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : khatamChosen ? (
              <View>
                <Text style={styles.headingText}>Please enter who or what you are making a khatam for</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={titleInput}
                  onChangeText={(text) => setTitleInput(text)}
                  placeholderTextColor={"#F4F4FC"}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => createNewRoom("Khatam", titleInput, 0)}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : tasbeehChosen ? (
              <View>
                <Text style={styles.headingText}>Please enter the subject of the room as well as the goal you would like to reach</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={titleInput}
                  onChangeText={(text) => setTitleInput(text)}
                  placeholderTextColor={"#F4F4FC"}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Goal"
                  onChangeText={(text) => setGoal(text)}
                  placeholderTextColor={"#F4F4FC"}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => createNewRoom("Tasbeeh", titleInput, goal)}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : QadhaSalaahChosen ? (
              <View>
                <Text style={styles.headingText}>Please enter the amount of days of Qadha Salaah that you have to make up for</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Goal"
                  onChangeText={(text) => setGoal(text)}
                  placeholderTextColor={"#F4F4FC"}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    createNewRoom("QadhaSalaah", "Qadha Salaah", goal)
                  }
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.headingText}>
                  Please select if you would like to create a new room, or join
                  an existing one if you have a code.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setCreateChosen(true)}
                >
                  <Text style={styles.buttonText}> Create a new room</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setJoinChosen(true)}
                >
                  <Text style={styles.buttonText}>Join an existing one</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                resetStates();
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#24293E",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#F4F4FC",
  },
  button: {
    backgroundColor: "#8EBBFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#F4F4FC",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#F4F4FC",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "#F4F4FC",
  },
  closeButton: {
    backgroundColor: "#DB504A",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#F4F4FC",
    fontSize: 16,
  },
});

export default ModalPopup;

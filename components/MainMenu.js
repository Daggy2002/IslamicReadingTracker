import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from 'react-native';


const ModalPopup = ({ visible, onClose, saveCode, createKhatam, createTasbeeh }) => {
  const [createChosen, setCreateChosen] = useState(false);
  const [joinChosen, setJoinChosen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [khatamChosen, setKhatamChosen] = useState(false);
  const [tasbeehChosen, setTasbeehChosen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [goal, setGoal] = useState(0);  

  const resetStates = () => {
    setCreateChosen(false);
    setJoinChosen(false);
    setKhatamChosen(false);
    setTasbeehChosen(false);
    setCodeInput('');
    setTitleInput('');
  };
  
  useEffect(() => {
    if(!visible){
      resetStates();
    }
  }, [visible]);

  tasbeehOnClick = () => {
    setTasbeehChosen(true);
    setCreateChosen(false);
  }

  khatamOnClick = () => {
    setKhatamChosen(true);
    setCreateChosen(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {createChosen ? (
              <View>
                <Text style={styles.headingText}>
                  Choose an Option
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={khatamOnClick}
                >
                  <Text style={styles.buttonText}>Quraan Khatam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={tasbeehOnClick}
                >
                  <Text style={styles.buttonText}>Tasbeeh Reading</Text>
                </TouchableOpacity>
              </View>
            ) : joinChosen ? (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter code"
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
                <Text style={styles.headingText}>Enter the details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a title for the khatam"
                  value={titleInput}
                  onChangeText={(text) => setTitleInput(text)}
                  placeholderTextColor={"#F4F4FC"}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => createKhatam(titleInput)}
                >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              </View>
            ) : tasbeehChosen ? ( 
              <View>
                <Text style={styles.headingText}>Enter the details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a title for the tasbeeh reading"
                  value={titleInput}
                  onChangeText={(text) => setTitleInput(text)}
                  placeholderTextColor={"#F4F4FC"}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter the goal amount for the tasbeeh reading"
                  onChangeText={(text) => setGoal(text)}
                  placeholderTextColor={"#F4F4FC"}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => createTasbeeh(titleInput, goal)}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                
              </View>
            ) : (
              <>
                <Text style={styles.headingText}>
                  Choose an Option
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setCreateChosen(true)}
                >
                  <Text style={styles.buttonText}>Create new</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setJoinChosen(true)}
                >
                  <Text style={styles.buttonText}>Have a code?</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#24293E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: "#F4F4FC"
  },
  button: {
    backgroundColor: '#8EBBFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#F4F4FC',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#F4F4FC',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "#F4F4FC"
  },
  closeButton: {
    backgroundColor: '#DB504A',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'center', 
  },
  closeButtonText: {
    color: '#F4F4FC',
    fontSize: 16,
  },
});

export default ModalPopup;

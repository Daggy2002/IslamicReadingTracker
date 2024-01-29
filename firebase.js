import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const firebaseConfig = {
  apiKey: "AIzaSyA-Sa0AIECDB2b5zeqPh6eWXfpTJnonZrA",
  authDomain: "counterapp-42be9.firebaseapp.com",
  projectId: "counterapp-42be9",
  storageBucket: "counterapp-42be9.appspot.com",
  messagingSenderId: "287687836618",
  appId: "1:287687836618:web:1113f2c098466fa28c8533",
  measurementId: "G-0VCCQVBFRQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

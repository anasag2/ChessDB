// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB37D1FgMGruUgsS3zmKHR9XWWyTcDC9aU",
  authDomain: "chess-7590e.firebaseapp.com",
  projectId: "chess-7590e",
  storageBucket: "chess-7590e.appspot.com",
  messagingSenderId: "86557921252",
  appId: "1:86557921252:web:67f073478fdf2c8bcdc1f1",
  measurementId: "G-QLZWYY61N5"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
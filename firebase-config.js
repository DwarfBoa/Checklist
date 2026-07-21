// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbe15VXxGOK-Cyn8R7LhCdBca02scIClk",
  authDomain: "checklist-aaa78.firebaseapp.com",
  databaseURL: "https://checklist-aaa78-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "checklist-aaa78",
  storageBucket: "checklist-aaa78.firebasestorage.app",
  messagingSenderId: "811744103873",
  appId: "1:811744103873:web:46da1c5bbcedaca5e1b340"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

export { db };
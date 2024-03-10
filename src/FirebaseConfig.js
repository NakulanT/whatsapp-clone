// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; // Import getDatabase from Firebase

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARVvtvSyIweAhFDMSmISWcY0sZlDPQcMk",
  authDomain: "whatsapp-clone-d3639.firebaseapp.com",
  projectId: "whatsapp-clone-d3639",
  storageBucket: "whatsapp-clone-d3639.appspot.com",
  messagingSenderId: "365797057348",
  appId: "1:365797057348:web:b51957347f93efa8946d11",
  measurementId: "G-L05GZW50NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Use getDatabase to get a reference to the database

export  { app };

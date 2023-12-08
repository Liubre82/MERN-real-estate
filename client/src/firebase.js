// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-9a14b.firebaseapp.com",
  projectId: "mern-real-estate-9a14b",
  storageBucket: "mern-real-estate-9a14b.appspot.com",
  messagingSenderId: "1060026186409",
  appId: "1:1060026186409:web:bfc97065c0ee210bf707b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
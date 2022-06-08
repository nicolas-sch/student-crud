// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDytY7Q6nrDhDdb0rUuSxaBXhp0Xh9Kscc",
  authDomain: "students-crud-1020b.firebaseapp.com",
  projectId: "students-crud-1020b",
  storageBucket: "students-crud-1020b.appspot.com",
  messagingSenderId: "722293047338",
  appId: "1:722293047338:web:4c6881b4e49d863a248353"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
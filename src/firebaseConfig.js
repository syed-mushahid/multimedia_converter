// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDUbZBhXtAq43NrhMwmOGb41FmRGZhXvj0",
    authDomain: "multimedia-90e81.firebaseapp.com",
    projectId: "multimedia-90e81",
    storageBucket: "multimedia-90e81.appspot.com",
    messagingSenderId: "310715783149",
    appId: "1:310715783149:web:05d1207ae899f3c5b8f9e4",
    measurementId: "G-BFP8SE5PVZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth ,db};

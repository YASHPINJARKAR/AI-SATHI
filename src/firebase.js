// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBP4jMqbh7Gamgl6WWY2FX3lnXpHiXxkp0",
    authDomain: "ai-sathi-98736.firebaseapp.com",
    projectId: "ai-sathi-98736",
    storageBucket: "ai-sathi-98736.firebasestorage.app",
    messagingSenderId: "637081339599",
    appId: "1:637081339599:web:e0f503265728166fe859ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBQ1iltk2LNWolypONJRyipHwo3YTIr2wM",
  authDomain: "mortgage-calculator-f9283.firebaseapp.com",
  projectId: "mortgage-calculator-f9283",
  storageBucket: "mortgage-calculator-f9283.appspot.com",
  messagingSenderId: "1081652688536",
  appId: "1:1081652688536:web:9870d03e1e1c8ced8842ed",
  measurementId: "G-MF3J3G7V5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Functions and get a reference to the service
const functions = getFunctions(app);

// Export all initialized services for use in other files
export { app, auth, db, functions };

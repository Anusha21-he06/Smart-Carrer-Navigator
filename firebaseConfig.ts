import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDemoPurposes",
  authDomain: "smart-career-navigator.firebaseapp.com",
  projectId: "smart-career-navigator",
  storageBucket: "smart-career-navigator.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * NOTE: Since this is a demo environment, actual Firebase Auth might fail
 * if the keys above aren't replaced with real ones.
 * The AuthContext will handle a "Mock" login for demonstration if Firebase fails.
 */
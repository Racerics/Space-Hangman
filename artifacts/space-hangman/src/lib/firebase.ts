import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAssQrpSHbjchR4UvhaAfN96pADA6CG1Lk",
  authDomain: "all-in-studio-007.firebaseapp.com",
  projectId: "all-in-studio-007",
  storageBucket: "all-in-studio-007.firebasestorage.app",
  messagingSenderId: "229696536480",
  appId: "1:229696536480:web:6c9cb18011f38cffddaec5",
  measurementId: "G-4RLQFWVVZC",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

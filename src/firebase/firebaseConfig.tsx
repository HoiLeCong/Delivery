// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN11gw5inTTlNlaiZRgjocqS7na3ChweA",
  authDomain: "shopping-app-3-410c2.firebaseapp.com",
  projectId: "shopping-app-3-410c2",
  storageBucket: "shopping-app-3-410c2.appspot.com",
  messagingSenderId: "290622766088",
  appId: "1:290622766088:web:7de1cfd5b08a9b7806a5bd",
  measurementId: "G-DY4S37K0LW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

 export {  auth, db };

// import { initializeApp } from "firebase/app";
// import { collection, getFirestore } from "firebase/firestore";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDN11gw5inTTlNlaiZRgjocqS7na3ChweA",
//   authDomain: "shopping-app-3-410c2.firebaseapp.com",
//   projectId: "shopping-app-3-410c2",
//   storageBucket: "shopping-app-3-410c2.appspot.com",
//   messagingSenderId: "290622766088",
//   appId: "1:290622766088:web:7de1cfd5b08a9b7806a5bd",
//   measurementId: "G-DY4S37K0LW",
// };

// const app = initializeApp(firebaseConfig);

// // Configure Auth with AsyncStorage for persistence
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// const db = getFirestore(app);

// isSupported()
//   .then((supported) => {
//     if (supported) {
//       getAnalytics(app);
//     }
//   })
//   .catch((error) => {
//     console.error("Analytics không được hỗ trợ:", error);
//   });

// const orderRef = collection(db, 'orders');
// const orderHistoryRef = collection(db, "orderHistory");
// const deliveryHistoryRef = collection(db, "deliveryHistory");
// const userRef = collection(db, "users");

// export { auth, db, orderRef, userRef, orderHistoryRef, deliveryHistoryRef };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore, } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
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
const db = getFirestore(app);

isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch((error) => {
    console.error("Analytics không được hỗ trợ:", error);
  });

const orderRef = collection(db, 'orders');
const orderHistoryRef = collection(db, "orderHistory");
const deliveryHistoryRef = collection(db, "deliveryHistory");
const userRef = collection(db, "users");

export { auth, db, orderRef, userRef, orderHistoryRef, deliveryHistoryRef };


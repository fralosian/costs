// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBXr6ZkD4OxcBeTqbgcQFsvd_6w33buHDE",
  authDomain: "meu-app-react-e55e2.firebaseapp.com",
  projectId: "meu-app-react-e55e2",
  storageBucket: "meu-app-react-e55e2.firebasestorage.app",
  messagingSenderId: "1028672785833",
  appId: "1:1028672785833:web:b9bc5587dcc8f8740908b8",
  measurementId: "G-HEFYDEWRMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);  // Exporta o Firestore como 'db'

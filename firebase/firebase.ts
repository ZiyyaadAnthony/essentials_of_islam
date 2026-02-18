import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzGcWKq1OCK3sm0jVs25yEcaV0ePkbTZo",
  authDomain: "islam-essentials-mvp.firebaseapp.com",
  projectId: "islam-essentials-mvp",
  storageBucket: "islam-essentials-mvp.firebasestorage.app",
  messagingSenderId: "646178704646",
  appId: "1:646178704646:web:712b819263e5e2c2992287"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

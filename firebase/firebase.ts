import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzGcWKq1OCK3sm0jVs25yEcaV0ePkbTZo",
  authDomain: "islam-essentials-mvp.firebaseapp.com",
  projectId: "islam-essentials-mvp",
  storageBucket: "islam-essentials-mvp.firebasestorage.app",
  messagingSenderId: "646178704646",
  appId: "1:646178704646:web:712b819263e5e2c2992287",
};

// Prevent re-initialization during Fast Refresh
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuration for Tapcard App
const firebaseConfig = {
  apiKey: "AIzaSyAmrMklNpx6w5Eyj8xPVBw7FkzKnYZrMKE",
  authDomain: "tapcard-app-469e2.firebaseapp.com",
  projectId: "tapcard-app-469e2",
  storageBucket: "tapcard-app-469e2.firebasestorage.app",
  messagingSenderId: "734225254092",
  appId: "1:734225254092:web:abe7e19ea56df4c47de469",
  measurementId: "G-KSW3VDB5JD",
};

// Initialize Firebase (Modular SDK style)
// This check prevents errors if the app is initialized more than once

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

export default app;

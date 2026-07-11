// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "penincoffe.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://penincoffe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "penincoffe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "penincoffe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy_sender_id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:dummy:web:dummy",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "dummy_measurement_id"
};

const app = initializeApp(firebaseConfig);

// Check if we have valid live keys or if we are using dummy keys
export const isFirebaseConfigured = firebaseConfig.apiKey !== "dummy_api_key" && !firebaseConfig.apiKey.includes("dummy");

// Only initialize getAuth if API keys are real, or on server-side where iframe.js is not spawned.
// This prevents the browser from loading iframe.js and throwing 400 Bad Request (auth/api-key-not-valid) on page load.
export const auth = (typeof window !== "undefined" && !isFirebaseConfigured)
  ? ({ currentUser: null, name: 'dummy_auth' } as any)
  : getAuth(app);

export const database = getDatabase(app);

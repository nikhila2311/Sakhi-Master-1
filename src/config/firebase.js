// src/config/firebase.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Include if you have it
};

// --- ADD THIS CONSOLE.LOG HERE ---
console.log("Firebase Config loaded:", firebaseConfig);
// --- END ADDITION ---

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Auth and get a reference to the service
export const auth = getAuth(app);

// --- Canvas Environment Specific Authentication ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfigFromCanvas = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

export const initializeFirebaseAndAuth = async () => {
  try {
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
      console.log("Firebase: Signed in with custom token (Canvas environment).");
    } else {
      await signInAnonymously(auth);
      console.log("Firebase: Signed in anonymously (no custom token).");
    }
  } catch (error) {
    console.error("Firebase Auth Error during initialization:", error);
    if (error.code === 'auth/invalid-custom-token') {
      console.warn("Firebase: Invalid custom auth token. Attempting anonymous sign-in.");
      await signInAnonymously(auth).catch(anonError => console.error("Firebase: Anonymous sign-in failed:", anonError));
    }
  }
};

initializeFirebaseAndAuth();

// --- IMPORTANT: Firebase Security Rules ---
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /journals/{journalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.owner;
    }
    match /emergencyData/{userEmail} {
      allow read, write: if request.auth != null && request.auth.uid == userEmail;
    }
    match /community/{postId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

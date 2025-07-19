// src/lib/firebase.ts

// Import the necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (you copied this from the Firebase Console)
// Insert the exact values from your Firebase project here!
const firebaseConfig = {
  apiKey: "AIzaSyAUtdjyhpxzBuRyHG9e7z4AAtZB2Sc3bZM",
  authDomain: "theleaderslab-homepage.firebaseapp.com",
  projectId: "theleaderslab-homepage",
  storageBucket: "theleaderslab-homepage.firebasestorage.app",
  messagingSenderId: "908093295014",
  appId: "1:908093295014:web:cddb716734caec15b3a767",
  measurementId: "G-EM58885T12"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the instances for Firestore (database) and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export the instances so they can be used in other parts of your app
export { db, auth };

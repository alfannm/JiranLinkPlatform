// src/auth.ts

// --------------------
// 🔹 Firebase Integration (Google Login + Firestore + Storage)
// --------------------

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your Firebase config (already verified)
const firebaseConfig = {
  apiKey: "AIzaSyDLpekosNGx7j2WOSgKKoYrXCxSCtTCljM",
  authDomain: "jiranlink-e28a7.firebaseapp.com",
  projectId: "jiranlink-e28a7",
  storageBucket: "jiranlink-e28a7.firebasestorage.app",
  messagingSenderId: "501458591791",
  appId: "1:501458591791:web:520b2ca12f79b892d3a6da",
  measurementId: "G-EZ25F7EJEV",
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --------------------
// 🔹 Google Sign-In
// --------------------
export async function googleLogin() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("✅ Google Sign-In success:", user);

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
      token: await user.getIdToken(),
    };
  } catch (err: any) {
    console.error("❌ Google login failed:", err);
    throw new Error("Google login failed — check Firebase Auth setup and internet connection.");
  }
}

// --------------------
// 🔹 Logout
// --------------------
export async function googleLogout() {
  try {
    await signOut(auth);
    console.log("✅ User signed out successfully");
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }
}

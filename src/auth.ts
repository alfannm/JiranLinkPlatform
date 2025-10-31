// src/auth.ts
import { registerPlugin } from '@capacitor/core';

// Register your custom native plugin
const HuaweiAuth = registerPlugin<any>('HuaweiAuth');

export const huaweiLogin = async () => {
  try {
    await HuaweiAuth.signIn();
    alert('Huawei login started — check your Huawei device.');
  } catch (err) {
    console.error('Huawei login failed:', err);
    alert('Huawei login failed — ensure HMS Core is installed.');
  }
};


// (Optional) Google Sign-In (Firebase web fallback)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_KEY',
  authDomain: 'jiranlink.firebaseapp.com',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    alert(`Logged in as ${result.user.displayName}`);
  } catch (err) {
    console.error('Google login failed:', err);
    alert('Google login failed');
  }
};

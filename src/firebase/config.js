
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBIq2rVd6h_vD6vEYT5SQ76ufQo3UG4bPE',
  authDomain: 'myassignmentapp-1.firebaseapp.com',
  projectId: 'myassignmentapp-1',
  // ✅ Use appspot.com for storage bucket
  storageBucket: 'myassignmentapp-1.appspot.com',
  messagingSenderId: '353128156640',
  appId: '1:353128156640:web:e3693002d92c0e624def85',
  // measurementId is fine to keep but not used by RN web SDK
  measurementId: 'G-G3M4FYXLL1',
};

const app = initializeApp(firebaseConfig);

// ✅ Persist auth state using AsyncStorage (React Native recommended setup)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

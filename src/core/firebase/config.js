import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyBIq2rVd6h_vD6vEYT5SQ76ufQo3UG4bPE',
  authDomain: 'myassignmentapp-1.firebaseapp.com',
  projectId: 'myassignmentapp-1',
  storageBucket: 'myassignmentapp-1.appspot.com',
  messagingSenderId: '353128156640',
  appId: '1:353128156640:web:e3693002d92c0e624def85',
  measurementId: 'G-G3M4FYXLL1',
};
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  export const db = getFirestore(app);

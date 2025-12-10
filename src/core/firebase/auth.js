// import { app } from "./config";
// import { getAuth } from "firebase/auth";

// export const auth = getAuth(app);
// src/core/firebase/auth.js
import { app } from "./config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const auth = getAuth(app);
export const db = getFirestore(app);

// -------------------- SIGN UP --------------------
export async function signUpWithEmail({ name, email, password, phone }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName: name });

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    name,
    email,
    phone,
    createdAt: serverTimestamp(),
  });

  return {
    uid: cred.user.uid,
    name,
    email,
    phone,
  };
}

// -------------------- SIGN IN --------------------
export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  return {
    uid: cred.user.uid,
    name: cred.user.displayName,
    email: cred.user.email,
  };
}

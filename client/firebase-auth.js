// Bundled into public/firebase-auth.js by `npm run build` (runs automatically after npm install).
import { initializeApp } from "firebase/app";
import {
  getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  onAuthStateChanged, signOut,
} from "firebase/auth";

let auth;

window.AtmaAuth = {
  async init(onChange) {
    const { firebase, emulator } = await (await fetch("/api/config")).json();
    auth = getAuth(initializeApp(firebase));
    if (emulator) connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    onAuthStateChanged(auth, onChange);
  },
  google: () => signInWithPopup(auth, new GoogleAuthProvider()),
  signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  logOut: () => signOut(auth),
  token: () => auth.currentUser?.getIdToken() ?? null,
};

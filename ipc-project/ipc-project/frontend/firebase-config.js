// firebase-config.js
// ---------------------------------------------------------------
// 1. Go to https://console.firebase.google.com -> create a project
// 2. Project settings -> General -> Add app -> Web app
// 3. Copy the config object it gives you and paste it below
// 4. In Authentication -> Sign-in method, enable "Email/Password"
//    and "Google"
// ---------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: replace with your project's Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Expose simple helper functions so app.js (a plain script) can call them
window.ipcAuth = {
  async signUp(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  },
  async signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },
  async signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  },
  async signOutUser() {
    await signOut(auth);
  },
  async getIdToken() {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  }
};

// Notify the rest of the app whenever the auth state changes
onAuthStateChanged(auth, user => {
  if (typeof window.onIPCAuthChange === "function") {
    window.onIPCAuthChange(user);
  }
});

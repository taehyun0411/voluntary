// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCza1NS6Uu2mGZ_gJdYHhJ_5L1wxrDWy9Q",
  authDomain: "voluntary-adca8.firebaseapp.com",
  projectId: "voluntary-adca8",
  storageBucket: "voluntary-adca8.firebasestorage.app",
  messagingSenderId: "888753844187",
  appId: "1:888753844187:web:6ad54f79af8a3b05f401fe",
  measurementId: "G-L4908BRZRF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

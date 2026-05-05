import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSIQYL66541dDCc666blX9IKZf83kmTiU",
  authDomain: "produtos-usuarios.firebaseapp.com",
  projectId: "produtos-usuarios",
  storageBucket: "produtos-usuarios.firebasestorage.app",
  messagingSenderId: "1048993441241",
  appId: "1:1048993441241:web:a4cc8cacc0e7086a1c65c8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

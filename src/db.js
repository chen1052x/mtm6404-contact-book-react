import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-VtTzeKtrneBok1D4R88ViLvE4X-IDrY",
  authDomain: "contact-book-c2333.firebaseapp.com",
  projectId: "contact-book-c2333",
  storageBucket: "contact-book-c2333.firebasestorage.app",
  messagingSenderId: "118181406813",
  appId: "1:118181406813:web:d53ed7f32465fb50bb45b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
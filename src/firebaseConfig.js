import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC72iOJWPsQ82KlN2mBx9DVBg0BSGDu5pg",
    authDomain: "pizzaweb-53903.firebaseapp.com",
    projectId: "pizzaweb-53903",
    storageBucket: "pizzaweb-53903.appspot.com",
    messagingSenderId: "802630861172",
    appId: "1:802630861172:web:4e22c8a47544a7c3032c21"
  };
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app);

export { firebaseConfig, auth, googleProvider, db };

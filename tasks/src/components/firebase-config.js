import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDda2YMo_-GEdfIC8wm2e0Mh_qMvhfrh-w",
    authDomain: "tasks-f2b78.firebaseapp.com",
    projectId: "tasks-f2b78",
    storageBucket: "tasks-f2b78.appspot.com",
    messagingSenderId: "777841564527",
    appId: "1:777841564527:web:16ec3316c791d31ade669a",
    measurementId: "G-LBDT71C8RK"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();
export {auth, GoogleProvider}
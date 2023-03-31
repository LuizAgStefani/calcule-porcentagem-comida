import firebase from "firebase";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuhJoKIe_Q6ouOBiKlgU4WETW-w2DLnAM",
  authDomain: "calculadora-alimentos.firebaseapp.com",
  projectId: "calculadora-alimentos",
  storageBucket: "calculadora-alimentos.appspot.com",
  messagingSenderId: "837442132171",
  appId: "1:837442132171:web:85c0bfcca75b00a0eaa34e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

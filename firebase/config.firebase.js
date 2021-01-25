import firebase from "firebase/app";
import "firebase/firestore";
import firebaseConfig from "./credentials.firebase";

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

export default firestore;

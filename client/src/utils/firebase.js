import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// Initialize Firebase and create a storage reference
const firebaseConfig = {
  apiKey: "AIzaSyBVn3wD7SEjWgdsTcqlTEiYLHGUdEnUVwA",
  authDomain: "futurepath-1f9e1.firebaseapp.com",
  projectId: "futurepath-1f9e1",
  storageBucket: "futurepath-1f9e1.appspot.com",
  messagingSenderId: "37565472414",
  appId: "1:37565472414:web:0f847408df292539f6258f",
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default storage;
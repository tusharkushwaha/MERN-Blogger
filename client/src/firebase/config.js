import firebase from 'firebase/app'
import "firebase/storage"


var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firebaseStorage = firebase.storage()

export { firebaseStorage }
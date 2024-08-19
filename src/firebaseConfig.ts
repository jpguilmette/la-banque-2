import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9B8P9SjXkJ5SlwRK97ELQG157JdVyemU",
  authDomain: "la-banque-17e36.firebaseapp.com",
  projectId: "la-banque-17e36",
  storageBucket: "la-banque-17e36.appspot.com",
  messagingSenderId: "1093485890263",
  appId: "1:1093485890263:web:659e759e8481cd059a3e92"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp };
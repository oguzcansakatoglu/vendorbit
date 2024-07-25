import {GoogleAuthProvider, getAuth} from 'firebase/auth';

import {getFirestore} from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';
import {initializeApp} from 'firebase/app';
const firebaseConfig = {
  apiKey: 'AIzaSyBpLdvgFsZpzQex4E4cFbtB5KRuwj8EuO0',
  authDomain: 'co-x-f6697.firebaseapp.com',
  projectId: 'co-x-f6697',
  storageBucket: 'co-x-f6697.appspot.com',
  messagingSenderId: '658919642567',
  appId: '1:658919642567:web:dc1eb689b159d9663bb5e2',
  measurementId: 'G-99VQVSG571',
};

const app = initializeApp(firebaseConfig);
console.log(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const provider = new GoogleAuthProvider();

const auth = getAuth();

export {db, functions, auth, provider};

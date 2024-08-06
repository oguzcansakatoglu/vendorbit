import {GoogleAuthProvider, getAuth} from 'firebase/auth';

import {getFirestore} from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';
import {initializeApp} from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA32Ro3KfTHdUPczyhT8zzjDC0ekmddlz8',
  authDomain: 'vendorbit-cab0c.firebaseapp.com',
  projectId: 'vendorbit-cab0c',
  storageBucket: 'vendorbit-cab0c.appspot.com',
  messagingSenderId: '236057317461',
  appId: '1:236057317461:web:56bdaf3cd1aff06820c4dc',
  measurementId: 'G-Y0M9TG0B38',
};

const app = initializeApp(firebaseConfig);
console.log(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const provider = new GoogleAuthProvider();

const auth = getAuth();

export {db, functions, auth, provider};

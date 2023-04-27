/* eslint-disable prettier/prettier */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAc-JBu8CLMeyFZuJaFzlgfk7_2wbUKuk4',
  authDomain: 'mobilebanking-bfee7.firebaseapp.com',
  projectId: 'mobilebanking-bfee7',
  storageBucket: 'mobilebanking-bfee7.appspot.com',
  messagingSenderId: '364758268502',
  appId: '1:364758268502:web:308da7c8469378fa1959f7',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings, {merge: true});

// Enable experimentalForceLongPolling for Firestore
const firestoreConfig = {
  experimentalForceLongPolling: true,
};
const firestore = firebase.firestore(firebase.app());
firestore.settings(firestoreConfig, {merge: true});

const auth = firebase.auth().useDeviceLanguage();
export {db, auth};

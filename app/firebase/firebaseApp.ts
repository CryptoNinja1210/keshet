import {initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
    apiKey: 'AIzaSyD3blrS28bZppPPlqLfYrw4n1-XFboBwH8', //process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: 'remediegenie.firebaseapp.com', //process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: 'remediegenie', //process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: 'remediegenie.appspot.com', //process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: '1050918019483', //process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: '1:1050918019483:web:38e2fb6c8f92f4c495c13e', //process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: 'G-LHBMJHMQD1', //process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
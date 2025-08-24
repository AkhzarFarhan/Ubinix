// Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Collection names
const COLLECTIONS = {
    USERS: 'users',
    DIARY_ENTRIES: 'diaryEntries',
    MOOD_ENTRIES: 'moodEntries',
    EXPENSES: 'expenses'
};

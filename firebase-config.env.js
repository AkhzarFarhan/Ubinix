// Firebase Configuration from Environment Variables
// This file reads Firebase configuration from environment variables or window object
// Safe for production deployment with GitHub Actions and secrets

(function() {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.warn("Firebase not available, initializing demo mode");
        if (typeof initDemoMode === 'function') {
            initDemoMode();
        }
        return;
    }

    // Firebase configuration from environment variables
    // These will be injected during build/deployment process
    const firebaseConfig = {
        apiKey: window.FIREBASE_API_KEY || "placeholder-api-key",
        authDomain: window.FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
        projectId: window.FIREBASE_PROJECT_ID || "placeholder-project",
        storageBucket: window.FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
        messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "000000000000",
        appId: window.FIREBASE_APP_ID || "placeholder-app-id"
    };

    // Validate configuration
    if (firebaseConfig.apiKey === "placeholder-api-key") {
        console.warn("Firebase configuration not properly set. Please configure environment variables.");
        console.info("For local development, copy firebase-config.template.js to firebase-config.js and configure with your Firebase credentials.");
    }

    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Initialize services
        window.auth = firebase.auth();
        window.db = firebase.firestore();

        // Collection names
        window.COLLECTIONS = {
            USERS: 'users',
            DIARY_ENTRIES: 'diaryEntries',
            MOOD_ENTRIES: 'moodEntries',
            EXPENSES: 'expenses'
        };

        console.log("Firebase initialized with project:", firebaseConfig.projectId);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        console.warn("Falling back to demo mode");
        if (typeof initDemoMode === 'function') {
            initDemoMode();
        }
    }
})();
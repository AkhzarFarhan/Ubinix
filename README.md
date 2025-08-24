# Ubinix - Personal Dashboard

A modern personal dashboard application built with Alpine.js and Firebase. Track your daily activities including diary entries, mood tracking, and expense management.

## Features

- **Authentication**: User registration and login with Firebase Auth
- **Diary Module**: Write and manage daily diary entries
- **Mood Tracker**: Track your daily emotional well-being with ratings 1-10
- **Expense Tracker**: Monitor your spending habits with categorized expenses
- **Dashboard Summary**: Overview of recent activities and statistics
- **Real-time Sync**: All data syncs in real-time with Firebase Firestore

## Technologies Used

- **Frontend**: Alpine.js, HTML5, CSS3
- **Backend**: Firebase (Firestore Database, Authentication)
- **UI Framework**: Custom CSS with modern design principles

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Copy your Firebase configuration from Project Settings
4. Copy the template file and configure your credentials:

```bash
# Copy the template file
cp firebase-config.template.js firebase-config.js
```

5. Replace the placeholder values in `firebase-config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

⚠️ **Important**: Never commit your actual `firebase-config.js` file to version control as it contains sensitive API keys.

### 2. Firebase Security Rules

Set up Firestore security rules to ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own diary entries
    match /diaryEntries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
    
    // Users can read/write their own mood entries
    match /moodEntries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
    
    // Users can read/write their own expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

### 3. Authentication Setup

1. In Firebase Console, go to Authentication > Settings
2. Enable Email/Password authentication
3. Optionally configure other sign-in methods

### 4. Local Development

1. Clone or download the project
2. Copy the Firebase configuration template:
   ```bash
   cp firebase-config.template.js firebase-config.js
   ```
3. Update `firebase-config.js` with your actual Firebase credentials
4. Serve the files through a local web server (Firebase hosting, Live Server, or similar)
5. Open the application in your browser

**Note**: The actual `firebase-config.js` file is excluded from version control for security reasons.

### 5. Test User (Optional)

For testing purposes, you can create a test account:
- Email: demo@example.com
- Password: demo123

## Project Structure

```
ubinix/
├── index.html                    # Main HTML file
├── app.js                       # Alpine.js application logic with Firebase integration
├── style.css                    # CSS styles
├── firebase-config.template.js  # Firebase configuration template (safe to commit)
├── firebase-config.js           # Firebase configuration (DO NOT COMMIT - in .gitignore)
├── firebase.json                # Firebase project configuration
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore database indexes
├── .gitignore                   # Git ignore file
├── README.md                    # Project documentation
├── DEPLOYMENT.md                # Deployment guide
└── LICENSE                      # License file
```

## Data Collections

The application uses the following Firestore collections:

- **users**: User profiles and metadata
- **diaryEntries**: Daily diary entries
- **moodEntries**: Mood tracking entries
- **expenses**: Expense tracking records

## Features Overview

### Authentication
- Email/password registration and login
- User session management
- Secure logout

### Diary Module
- Create, read, update, and delete diary entries
- Date-based organization
- Character count for entries

### Mood Tracker
- 10-point mood rating system with emojis
- Daily mood entries with optional notes
- Mood history visualization

### Expense Tracker
- Categorized expense tracking
- Monthly and total expense summaries
- Recent expenses list

### Dashboard Summary
- Overview of recent activities
- Monthly expense totals
- Activity statistics
- Recent activity feed

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

This project is licensed under the MIT License - see the LICENSE file for details.
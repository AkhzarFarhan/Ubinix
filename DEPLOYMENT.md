# Deployment Guide for Ubinix

This guide will help you deploy the Ubinix personal dashboard to Firebase Hosting.

## Prerequisites

1. Node.js and npm installed
2. Firebase CLI installed: `npm install -g firebase-tools`
3. A Firebase project created
4. Firebase configuration set up (see step 0 below)

## Step-by-Step Deployment

### 0. Setup Firebase Configuration

Before deployment, ensure you have configured your Firebase credentials:

```bash
# Copy the configuration template
cp firebase-config.template.js firebase-config.js

# Edit firebase-config.js with your actual Firebase project credentials
# (Get these from Firebase Console > Project Settings > Your apps)
```

⚠️ **Security Note**: Never commit your actual `firebase-config.js` file. It's already included in `.gitignore`.

### 1. Initialize Firebase Project

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project directory
firebase init

# Select the following features:
# - Firestore
# - Hosting

# Choose your existing Firebase project
# Use default settings for Firestore rules and indexes
# Set public directory to: . (current directory)
# Configure as single-page app: Yes
# Set up automatic builds and deploys: No (optional)
```

### 2. Configure Firestore Security Rules

Replace the content of `firestore.rules` with the rules provided in the project, then deploy:

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### 4. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 5. Test Your Deployment

After successful deployment, Firebase will provide you with hosting URLs:
- Project Console: https://console.firebase.google.com/project/YOUR_PROJECT/hosting
- Live App: https://YOUR_PROJECT.web.app

## Environment-Specific Configuration

### Development
- Use Firebase Emulators for local development
- Run `firebase emulators:start` to start local emulators

### Production
- Ensure proper Firebase security rules are in place
- Monitor usage in Firebase Console
- Set up backup strategies for Firestore data

## Post-Deployment Steps

1. **Test Authentication**: Create a test user and verify login/logout functionality
2. **Test Data Operations**: Create diary entries, mood entries, and expenses
3. **Check Security Rules**: Verify users can only access their own data
4. **Monitor Performance**: Use Firebase Console to monitor app usage
5. **Set up Analytics** (optional): Enable Firebase Analytics for user insights

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Firebase Auth configuration and API keys
2. **Firestore Permission Denied**: Verify security rules are correctly deployed
3. **Loading Issues**: Check browser console for JavaScript errors
4. **CORS Issues**: Ensure proper domain configuration in Firebase Console

### Firebase Console Checks

1. **Authentication**: Verify Email/Password provider is enabled
2. **Firestore Database**: Check that collections are created and rules are active
3. **Hosting**: Verify domain configuration and SSL certificate

## Monitoring and Maintenance

1. **Regular Backups**: Set up automated Firestore backups
2. **Security Rules Review**: Periodically review and update security rules
3. **Performance Monitoring**: Monitor app performance through Firebase Console
4. **User Feedback**: Implement feedback collection for continuous improvement

## Cost Optimization

1. **Firestore Usage**: Monitor document reads/writes to stay within free tier
2. **Storage Optimization**: Regularly clean up unused data
3. **Bandwidth**: Optimize images and assets for web delivery
4. **Authentication**: Monitor monthly active users (MAU) limits

For more detailed information, refer to the [Firebase Documentation](https://firebase.google.com/docs).

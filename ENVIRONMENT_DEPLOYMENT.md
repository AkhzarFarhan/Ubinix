# Environment Variables Deployment Guide

This guide explains how to deploy the Ubinix Personal Dashboard using environment variables for Firebase configuration, supporting both Firebase Hosting and GitHub Pages deployment methods.

## Overview

Instead of storing sensitive Firebase configuration in a `firebase-config.js` file, this approach uses environment variables to inject the configuration during deployment. This is more secure and suitable for public repositories.

## Prerequisites

1. A Firebase project with Authentication and Firestore enabled
2. Firebase configuration values from your project settings
3. GitHub repository with the code

## Method 1: Firebase Hosting with GitHub Actions (Recommended)

### Setup Steps

1. **Get Firebase Configuration**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Project Settings → Your apps
   - Copy the configuration values

2. **Get Firebase Token**
   ```bash
   # Install Firebase CLI (if not installed)
   npm install -g firebase-tools
   
   # Login and get token
   firebase login:ci
   ```
   Save the generated token for step 3.

3. **Configure GitHub Secrets**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `FIREBASE_API_KEY`: Your Firebase API key
     - `FIREBASE_AUTH_DOMAIN`: Your project auth domain
     - `FIREBASE_PROJECT_ID`: Your Firebase project ID
     - `FIREBASE_STORAGE_BUCKET`: Your storage bucket
     - `FIREBASE_MESSAGING_SENDER_ID`: Your messaging sender ID
     - `FIREBASE_APP_ID`: Your Firebase app ID
     - `FIREBASE_TOKEN`: The token from step 2

4. **Deploy**
   - Push your code to the `main` branch
   - GitHub Actions will automatically deploy to Firebase Hosting
   - Your app will be available at `https://YOUR_PROJECT_ID.web.app`

## Method 2: GitHub Pages Deployment

### Setup Steps

1. **Enable GitHub Pages**
   - Go to your repository → Settings → Pages
   - Source: GitHub Actions

2. **Configure GitHub Secrets**
   - Add the same Firebase secrets as in Method 1 (except FIREBASE_TOKEN is not needed)

3. **Deploy**
   - Push your code to the `main` branch
   - GitHub Actions will deploy to GitHub Pages
   - Your app will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Local Development

For local development, you still need to create a `firebase-config.js` file:

```bash
# Copy the template
cp firebase-config.template.js firebase-config.js

# Edit firebase-config.js with your actual Firebase configuration
```

The `firebase-config.js` file remains in `.gitignore` and is only used for local development.

## Security Benefits

- ✅ Sensitive Firebase keys are stored in GitHub Secrets
- ✅ No sensitive data committed to version control
- ✅ Automated deployment process
- ✅ Different configurations for different environments
- ✅ Compatible with both Firebase Hosting and GitHub Pages

## Workflow Files

The repository includes two GitHub Actions workflows:

- `.github/workflows/deploy.yml`: Deploys to Firebase Hosting
- `.github/workflows/deploy-pages.yml`: Deploys to GitHub Pages

Choose the method that best fits your needs. Firebase Hosting is recommended for Firebase-based applications as it provides better integration and features for web apps.

## Troubleshooting

### Common Issues

1. **Missing Secrets**: Ensure all required secrets are added to your GitHub repository
2. **Firebase Token Issues**: Generate a new token using `firebase login:ci`
3. **Permission Errors**: Check that your Firebase project has proper permissions
4. **Build Failures**: Check the Actions tab for detailed error logs

### Verifying Configuration

After deployment, check the browser console to ensure Firebase is initialized correctly:
- Look for "Firebase initialized with project: YOUR_PROJECT_ID"
- Verify no authentication or configuration errors appear

## Migration from Local Config

If you're migrating from the local `firebase-config.js` approach:

1. Add the GitHub secrets with your Firebase configuration
2. Your existing local development setup continues to work
3. New deployments will use environment variables automatically
4. Remove any existing `firebase-config.js` from version control (it should already be in `.gitignore`)
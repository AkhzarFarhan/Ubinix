# Firebase Configuration Solutions

This document addresses two approaches for handling Firebase configuration in the Ubinix project:

## 🔐 Option 1: Keep firebase-config.js Local (Current Approach)

### Where to keep firebase-config.js
The `firebase-config.js` file should be kept **locally** and **never committed** to version control:

```bash
# Copy the template (this file is committed)
cp firebase-config.template.js firebase-config.js

# Edit with your actual Firebase configuration
# This file is in .gitignore and stays local
```

**Location**: Root directory of your project (`/home/user/project/firebase-config.js`)

**Security**: The file is already properly excluded in `.gitignore`:
```gitignore
# Firebase Configuration (contains sensitive API keys)
firebase-config.js
```

### Local Development Setup
1. Clone the repository
2. Run: `cp firebase-config.template.js firebase-config.js`
3. Edit `firebase-config.js` with your actual Firebase credentials
4. Serve with a local web server: `python3 -m http.server 8000`
5. Open `http://localhost:8000` in your browser

---

## 🚀 Option 2: GitHub Hosting with Environment Variables (Recommended)

This approach uses GitHub Secrets to store Firebase configuration and deploys automatically.

### Benefits
- ✅ Secure: No sensitive data in your repository
- ✅ Automated deployment on every push
- ✅ Works with both Firebase Hosting and GitHub Pages
- ✅ Team-friendly: Others can contribute without needing Firebase keys

### Setup Instructions

#### Step 1: Add GitHub Secrets
Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your project auth domain (e.g., `myapp.firebaseapp.com`)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your storage bucket (e.g., `myapp.appspot.com`)
- `FIREBASE_MESSAGING_SENDER_ID`: Your messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID

For Firebase Hosting, also add:
- `FIREBASE_TOKEN`: Get this by running `firebase login:ci`

#### Step 2: Choose Deployment Method

**Option A: Firebase Hosting (Recommended)**
- Uses the `.github/workflows/deploy.yml` workflow
- Deploys to `https://YOUR_PROJECT_ID.web.app`
- Full Firebase integration

**Option B: GitHub Pages**
- Uses the `.github/workflows/deploy-pages.yml` workflow
- Deploys to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- Free GitHub hosting

#### Step 3: Enable Deployment
- Push your code to the `main` branch
- Check the Actions tab to see deployment progress
- Your app will be automatically deployed!

### How It Works
1. GitHub Actions reads your Firebase configuration from secrets
2. A build script injects these values into the HTML as `window` variables
3. The `firebase-config.env.js` file reads from these window variables
4. Firebase is initialized with your actual configuration

## 🧪 Testing Environment Variables Locally

Use the provided helper script:
```bash
# Run the setup helper
./setup-env.sh

# This creates:
# - .env.local (template for your environment variables)
# - test-env-local.html (test page to verify configuration)
```

Edit the test file with your actual Firebase values and open it in a browser to verify the configuration works.

## 📂 File Structure with Environment Variables

```
ubinix/
├── firebase-config.template.js  # Template (committed)
├── firebase-config.js           # Local only (DO NOT COMMIT)
├── firebase-config.env.js       # Environment-based config (committed)
├── .github/workflows/
│   ├── deploy.yml              # Firebase Hosting deployment
│   └── deploy-pages.yml        # GitHub Pages deployment
├── setup-env.sh                # Local development helper
└── ENVIRONMENT_DEPLOYMENT.md   # Detailed deployment guide
```

## 🚨 Important Security Notes

- Never commit actual Firebase keys to any repository
- Use GitHub Secrets for production deployments
- Keep `firebase-config.js` local for development only
- The `.gitignore` file properly excludes sensitive files

## 🔄 Migration Guide

**From local-only setup to environment variables:**
1. Your existing local `firebase-config.js` continues to work for development
2. Add GitHub Secrets with your Firebase configuration
3. Push to `main` branch to trigger automated deployment
4. Your app will be deployed with secure environment variable configuration

**No breaking changes** - both approaches can coexist!
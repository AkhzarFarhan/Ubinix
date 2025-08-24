#!/bin/bash

# Local Development Helper Script
# This script helps you test the environment variable configuration locally

echo "🔥 Firebase Environment Configuration Helper"
echo "=============================================="
echo ""

# Check if firebase-config.js exists for local development
if [ ! -f "firebase-config.js" ]; then
    echo "⚠️  firebase-config.js not found. Creating from template..."
    cp firebase-config.template.js firebase-config.js
    echo "📝 Please edit firebase-config.js with your actual Firebase configuration."
    echo "   This file is for local development only and won't be committed."
    echo ""
fi

# Create a test environment variables file
echo "🧪 Creating test environment variables..."
cat > .env.local << 'EOF'
# Local Environment Variables for Testing
# These simulate what GitHub Actions will inject during deployment

export FIREBASE_API_KEY="your-api-key-here"
export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
export FIREBASE_MESSAGING_SENDER_ID="123456789"
export FIREBASE_APP_ID="your-app-id"
EOF

echo "📄 Created .env.local file with template environment variables"
echo "📝 Please edit .env.local with your actual Firebase configuration."
echo ""

# Create a test HTML file with environment variables
echo "🔨 Creating test file with environment variable injection..."

cat > test-env-local.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Environment Variables Test</title>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    
    <!-- Environment Variables (these would be injected by GitHub Actions) -->
    <script>
      // Load from your .env.local file or set manually for testing
      window.FIREBASE_API_KEY = "your-api-key-here";
      window.FIREBASE_AUTH_DOMAIN = "your-project.firebaseapp.com";
      window.FIREBASE_PROJECT_ID = "your-project-id";
      window.FIREBASE_STORAGE_BUCKET = "your-project.appspot.com";
      window.FIREBASE_MESSAGING_SENDER_ID = "123456789";
      window.FIREBASE_APP_ID = "your-app-id";
    </script>
    
    <script src="firebase-config.env.js"></script>
</head>
<body>
    <h1>🔥 Firebase Environment Configuration Test</h1>
    <div id="output"></div>
    
    <script>
        const output = document.getElementById('output');
        
        try {
            if (firebase.apps.length > 0) {
                output.innerHTML += '<p style="color: green;">✅ Firebase initialized successfully</p>';
                output.innerHTML += '<p>📱 Project ID: ' + window.FIREBASE_PROJECT_ID + '</p>';
                
                if (window.auth) {
                    output.innerHTML += '<p style="color: green;">✅ Firebase Auth available</p>';
                } else {
                    output.innerHTML += '<p style="color: red;">❌ Firebase Auth not available</p>';
                }
                
                if (window.db) {
                    output.innerHTML += '<p style="color: green;">✅ Firestore available</p>';
                } else {
                    output.innerHTML += '<p style="color: red;">❌ Firestore not available</p>';
                }
                
                if (window.COLLECTIONS) {
                    output.innerHTML += '<p style="color: green;">✅ Collections defined: ' + Object.keys(window.COLLECTIONS).join(', ') + '</p>';
                } else {
                    output.innerHTML += '<p style="color: red;">❌ Collections not defined</p>';
                }
                
                output.innerHTML += '<p style="color: blue;">🎉 Configuration is working! You can now use the main app.</p>';
            } else {
                output.innerHTML += '<p style="color: red;">❌ Firebase not initialized</p>';
            }
        } catch (error) {
            output.innerHTML += '<p style="color: red;">❌ Error: ' + error.message + '</p>';
        }
    </script>
</body>
</html>
EOF

echo "🧪 Created test-env-local.html for testing environment variable configuration"
echo ""

echo "📋 Next Steps:"
echo "1. Edit .env.local with your actual Firebase configuration"
echo "2. Edit test-env-local.html to use your actual Firebase values"
echo "3. Open test-env-local.html in your browser to test the configuration"
echo "4. If the test passes, your environment variable setup is working!"
echo ""

echo "🚀 For GitHub deployment:"
echo "1. Add your Firebase configuration to GitHub Secrets"
echo "2. Push your code to trigger the deployment workflow"
echo "3. Check the Actions tab for deployment status"
echo ""

echo "📚 See ENVIRONMENT_DEPLOYMENT.md for detailed instructions."
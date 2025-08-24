// Standalone demo for when CDNs are blocked or Firebase is not configured
// This provides a working version of the dashboard without external dependencies

(function() {
    // Check if Alpine.js is available
    if (typeof Alpine === 'undefined') {
        console.log('Alpine.js not available, initializing standalone demo mode');
        initStandaloneDemo();
        return;
    }

    // If Alpine.js is available, it will handle initialization through app.js
    console.log('Alpine.js available, using original app.js');
})();

function initStandaloneDemo() {
    // Demo application state
    const demoState = {
        currentModule: 'summary',
        isAuthenticated: false,
        loading: false,
        selectedMood: null,
        diaryEntries: [
            { id: 1, title: 'Great day today!', date: '2024-08-24', content: 'Had a wonderful day working on projects and spending time with family.' }
        ],
        expenses: [
            { id: 1, amount: 150, category: 'Food', description: 'Lunch at restaurant', date: '2024-08-24' }
        ]
    };

    // Utility functions
    function showElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'block';
    }

    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    }

    function updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }

    // Main demo functions
    window.enterDemo = function() {
        hideElement('login-screen');
        showElement('dashboard');
        demoState.isAuthenticated = true;
        // Initially show summary module and hide others
        setModule('summary');
        console.log('Entered demo mode');
    };

    window.logout = function() {
        hideElement('dashboard');
        showElement('login-screen');
        demoState.isAuthenticated = false;
        console.log('Logged out of demo');
    };

    window.setModule = function(module) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        // Show selected module
        showElement('module-' + module);
        // Add active class to selected nav item
        const navItem = document.getElementById('nav-' + module);
        if (navItem) navItem.classList.add('active');
        
        demoState.currentModule = module;
        console.log('Switched to module:', module);
    };

    window.selectMood = function(rating, emoji) {
        // Remove selected class from all mood options
        document.querySelectorAll('.mood-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        event.target.closest('.mood-option').classList.add('selected');
        
        demoState.selectedMood = { rating, emoji };
        console.log('Selected mood:', rating, emoji);
    };

    window.saveDiaryEntry = function(event) {
        event.preventDefault();
        const title = document.getElementById('diary-title').value;
        const content = document.getElementById('diary-content').value;
        const date = document.getElementById('diary-date').value;

        if (title && content) {
            console.log('Demo: Saving diary entry', { title, content, date });
            alert('Diary entry saved! (Demo mode - not persisted)');
            clearDiaryForm();
        }
    };

    window.clearDiaryForm = function() {
        document.getElementById('diary-title').value = '';
        document.getElementById('diary-content').value = '';
        document.getElementById('diary-date').value = new Date().toISOString().split('T')[0];
    };

    window.saveMoodEntry = function(event) {
        event.preventDefault();
        const notes = document.getElementById('mood-notes').value;
        const date = document.getElementById('mood-date').value;

        if (demoState.selectedMood) {
            console.log('Demo: Saving mood entry', { ...demoState.selectedMood, notes, date });
            alert('Mood entry saved! (Demo mode - not persisted)');
            clearMoodForm();
        } else {
            alert('Please select a mood rating first');
        }
    };

    window.clearMoodForm = function() {
        document.getElementById('mood-notes').value = '';
        document.getElementById('mood-date').value = new Date().toISOString().split('T')[0];
        document.querySelectorAll('.mood-option').forEach(option => {
            option.classList.remove('selected');
        });
        demoState.selectedMood = null;
    };

    window.saveExpense = function(event) {
        event.preventDefault();
        const amount = document.getElementById('expense-amount').value;
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value;
        const date = document.getElementById('expense-date').value;

        if (amount && category) {
            console.log('Demo: Saving expense', { amount, category, description, date });
            alert('Expense saved! (Demo mode - not persisted)');
            clearExpenseForm();
        }
    };

    window.clearExpenseForm = function() {
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-category').value = '';
        document.getElementById('expense-description').value = '';
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    };

    // Initialize demo
    document.addEventListener('DOMContentLoaded', function() {
        // Check if Alpine.js is available, if not, manage visibility manually
        if (typeof Alpine === 'undefined') {
            // Initially hide dashboard since Alpine x-show directives won't work
            hideElement('dashboard');
            
            // Set default dates
            const today = new Date().toISOString().split('T')[0];
            const diaryDate = document.getElementById('diary-date');
            const moodDate = document.getElementById('mood-date');
            const expenseDate = document.getElementById('expense-date');
            
            if (diaryDate) diaryDate.value = today;
            if (moodDate) moodDate.value = today;
            if (expenseDate) expenseDate.value = today;
            
            // Add click handlers to navigation buttons
            const navButtons = [
                { id: 'nav-summary', module: 'summary' },
                { id: 'nav-diary', module: 'diary' },
                { id: 'nav-mood', module: 'mood' },
                { id: 'nav-expenses', module: 'expenses' }
            ];
            
            navButtons.forEach(({ id, module }) => {
                const button = document.getElementById(id);
                if (button) {
                    button.onclick = () => setModule(module);
                }
            });
            
            // Add logout functionality
            const logoutButtons = document.querySelectorAll('button');
            logoutButtons.forEach(button => {
                if (button.textContent.includes('Logout')) {
                    button.onclick = logout;
                }
            });
            
            // Add demo login functionality to the existing login form
            const loginForms = document.querySelectorAll('form');
            loginForms.forEach(form => {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton && submitButton.textContent.includes('Sign In')) {
                    form.onsubmit = function(e) {
                        e.preventDefault();
                        enterDemo();
                    };
                }
            });
            
            console.log('Added click handlers for standalone demo mode');
            
            // Hide loading and show login after brief delay
            setTimeout(() => {
                hideElement('loading');
                showElement('login-screen');
                console.log('Standalone demo initialized. Firebase and Alpine.js not required.');
            }, 1000);
        }
    });
}
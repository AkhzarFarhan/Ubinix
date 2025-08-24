// Personal Dashboard Application using Alpine.js with Firebase

document.addEventListener('alpine:init', () => {
    Alpine.data('appData', () => ({
        // Authentication state
        isAuthenticated: false,
        showRegister: false,
        currentUser: null,
        authError: '',
        loading: false,

        // Current module
        currentModule: 'summary',

        // Form states
        showDiaryForm: false,

        // Login/Register forms
        loginForm: {
            email: 'demo@example.com',
            password: 'demo123'
        },
        registerForm: {
            username: '',
            email: '',
            password: ''
        },

        // Module forms
        diaryForm: {
            id: null,
            date: new Date().toISOString().split('T')[0],
            title: '',
            content: ''
        },
        moodForm: {
            date: new Date().toISOString().split('T')[0],
            mood_rating: null,
            mood_emoji: '',
            notes: ''
        },
        expenseForm: {
            date: new Date().toISOString().split('T')[0],
            amount: '',
            category: '',
            description: ''
        },

        // Data stores - these will be populated from Firebase
        diaryEntries: [],
        moodEntries: [],
        expenses: [],

        // Static data
        expenseCategories: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"],
        moodOptions: [
            {"rating": 1, "emoji": "😢", "label": "Very Sad"},
            {"rating": 2, "emoji": "😞", "label": "Sad"},
            {"rating": 3, "emoji": "😕", "label": "Disappointed"},
            {"rating": 4, "emoji": "😐", "label": "Neutral"},
            {"rating": 5, "emoji": "🙂", "label": "Okay"},
            {"rating": 6, "emoji": "😊", "label": "Happy"},
            {"rating": 7, "emoji": "😄", "label": "Very Happy"},
            {"rating": 8, "emoji": "😁", "label": "Excited"},
            {"rating": 9, "emoji": "🤗", "label": "Joyful"},
            {"rating": 10, "emoji": "🥳", "label": "Ecstatic"}
        ],

        // Initialize component
        async init() {
            this.loading = true;
            try {
                // Listen for auth state changes
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        this.currentUser = {
                            id: user.uid,
                            email: user.email,
                            username: user.displayName || user.email.split('@')[0]
                        };
                        this.isAuthenticated = true;
                        await this.loadUserData();
                    } else {
                        this.currentUser = null;
                        this.isAuthenticated = false;
                        this.clearData();
                    }
                    this.loading = false;
                });
            } catch (error) {
                console.error('Initialization error:', error);
                this.loading = false;
            }
        },

        // Load all user data from Firebase
        async loadUserData() {
            if (!this.currentUser) return;
            
            try {
                await Promise.all([
                    this.loadDiaryEntries(),
                    this.loadMoodEntries(),
                    this.loadExpenses()
                ]);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        },

        // Clear local data
        clearData() {
            this.diaryEntries = [];
            this.moodEntries = [];
            this.expenses = [];
        },

        // Authentication methods
        async login() {
            this.loading = true;
            this.authError = '';
            
            try {
                await auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password);
                // User data will be loaded by the auth state listener
            } catch (error) {
                console.error('Login error:', error);
                this.authError = this.getAuthErrorMessage(error);
            }
            
            this.loading = false;
        },

        async register() {
            if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password) {
                this.authError = 'All fields are required';
                return;
            }

            this.loading = true;
            this.authError = '';

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(
                    this.registerForm.email, 
                    this.registerForm.password
                );
                
                // Update display name
                await userCredential.user.updateProfile({
                    displayName: this.registerForm.username
                });

                // Create user profile in Firestore
                await db.collection(COLLECTIONS.USERS).doc(userCredential.user.uid).set({
                    username: this.registerForm.username,
                    email: this.registerForm.email,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Reset form
                this.registerForm = { username: '', email: '', password: '' };
                
            } catch (error) {
                console.error('Registration error:', error);
                this.authError = this.getAuthErrorMessage(error);
            }
            
            this.loading = false;
        },

        async logout() {
            this.loading = true;
            try {
                await auth.signOut();
                this.currentModule = 'summary';
                this.showRegister = false;
                this.authError = '';
            } catch (error) {
                console.error('Logout error:', error);
            }
            this.loading = false;
        },

        // Error message handler
        getAuthErrorMessage(error) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    return 'Invalid email or password';
                case 'auth/email-already-in-use':
                    return 'Email is already registered';
                case 'auth/weak-password':
                    return 'Password should be at least 6 characters';
                case 'auth/invalid-email':
                    return 'Invalid email address';
                default:
                    return 'Authentication error. Please try again.';
            }
        },

        // Navigation
        setCurrentModule(module) {
            this.currentModule = module;
            this.showDiaryForm = false;
        },

        // Diary methods
        async loadDiaryEntries() {
            try {
                const snapshot = await db.collection(COLLECTIONS.DIARY_ENTRIES)
                    .where('user_id', '==', this.currentUser.id)
                    .orderBy('date', 'desc')
                    .get();
                
                this.diaryEntries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error('Error loading diary entries:', error);
            }
        },

        async saveDiaryEntry() {
            if (!this.diaryForm.title || !this.diaryForm.content) {
                alert('Please fill in both title and content');
                return;
            }

            this.loading = true;
            try {
                if (this.diaryForm.id) {
                    // Update existing entry
                    await db.collection(COLLECTIONS.DIARY_ENTRIES).doc(this.diaryForm.id).update({
                        title: this.diaryForm.title,
                        content: this.diaryForm.content,
                        date: this.diaryForm.date,
                        updated_at: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    // Add new entry
                    await db.collection(COLLECTIONS.DIARY_ENTRIES).add({
                        user_id: this.currentUser.id,
                        date: this.diaryForm.date,
                        title: this.diaryForm.title,
                        content: this.diaryForm.content,
                        created_at: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                await this.loadDiaryEntries();
                this.resetDiaryForm();
                this.showDiaryForm = false;
            } catch (error) {
                console.error('Error saving diary entry:', error);
                alert('Error saving diary entry. Please try again.');
            }
            this.loading = false;
        },

        editDiaryEntry(entry) {
            this.diaryForm = {
                id: entry.id,
                date: entry.date,
                title: entry.title,
                content: entry.content
            };
            this.showDiaryForm = true;
        },

        async deleteDiaryEntry(id) {
            if (confirm('Are you sure you want to delete this diary entry?')) {
                this.loading = true;
                try {
                    await db.collection(COLLECTIONS.DIARY_ENTRIES).doc(id).delete();
                    await this.loadDiaryEntries();
                } catch (error) {
                    console.error('Error deleting diary entry:', error);
                    alert('Error deleting diary entry. Please try again.');
                }
                this.loading = false;
            }
        },

        resetDiaryForm() {
            this.diaryForm = {
                id: null,
                date: new Date().toISOString().split('T')[0],
                title: '',
                content: ''
            };
        },

        // Mood methods
        async loadMoodEntries() {
            try {
                const snapshot = await db.collection(COLLECTIONS.MOOD_ENTRIES)
                    .where('user_id', '==', this.currentUser.id)
                    .orderBy('date', 'desc')
                    .get();
                
                this.moodEntries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error('Error loading mood entries:', error);
            }
        },

        selectMood(mood) {
            this.moodForm.mood_rating = mood.rating;
            this.moodForm.mood_emoji = mood.emoji;
        },

        async saveMoodEntry() {
            if (!this.moodForm.mood_rating) {
                alert('Please select a mood rating');
                return;
            }

            this.loading = true;
            try {
                await db.collection(COLLECTIONS.MOOD_ENTRIES).add({
                    user_id: this.currentUser.id,
                    date: this.moodForm.date,
                    mood_rating: this.moodForm.mood_rating,
                    mood_emoji: this.moodForm.mood_emoji,
                    notes: this.moodForm.notes,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                });

                await this.loadMoodEntries();
                this.resetMoodForm();
            } catch (error) {
                console.error('Error saving mood entry:', error);
                alert('Error saving mood entry. Please try again.');
            }
            this.loading = false;
        },

        async deleteMoodEntry(id) {
            if (confirm('Are you sure you want to delete this mood entry?')) {
                this.loading = true;
                try {
                    await db.collection(COLLECTIONS.MOOD_ENTRIES).doc(id).delete();
                    await this.loadMoodEntries();
                } catch (error) {
                    console.error('Error deleting mood entry:', error);
                    alert('Error deleting mood entry. Please try again.');
                }
                this.loading = false;
            }
        },

        resetMoodForm() {
            this.moodForm = {
                date: new Date().toISOString().split('T')[0],
                mood_rating: null,
                mood_emoji: '',
                notes: ''
            };
        },

        // Expense methods
        async loadExpenses() {
            try {
                const snapshot = await db.collection(COLLECTIONS.EXPENSES)
                    .where('user_id', '==', this.currentUser.id)
                    .orderBy('date', 'desc')
                    .get();
                
                this.expenses = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error('Error loading expenses:', error);
            }
        },

        async saveExpense() {
            if (!this.expenseForm.amount || !this.expenseForm.category) {
                alert('Please fill in amount and category');
                return;
            }

            this.loading = true;
            try {
                await db.collection(COLLECTIONS.EXPENSES).add({
                    user_id: this.currentUser.id,
                    date: this.expenseForm.date,
                    amount: parseFloat(this.expenseForm.amount),
                    category: this.expenseForm.category,
                    description: this.expenseForm.description,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                });

                await this.loadExpenses();
                this.resetExpenseForm();
            } catch (error) {
                console.error('Error saving expense:', error);
                alert('Error saving expense. Please try again.');
            }
            this.loading = false;
        },

        async deleteExpense(id) {
            if (confirm('Are you sure you want to delete this expense?')) {
                this.loading = true;
                try {
                    await db.collection(COLLECTIONS.EXPENSES).doc(id).delete();
                    await this.loadExpenses();
                } catch (error) {
                    console.error('Error deleting expense:', error);
                    alert('Error deleting expense. Please try again.');
                }
                this.loading = false;
            }
        },

        resetExpenseForm() {
            this.expenseForm = {
                date: new Date().toISOString().split('T')[0],
                amount: '',
                category: '',
                description: ''
            };
        },

        // Summary methods
        getLatestMood() {
            return this.moodEntries.find(entry => entry.user_id === this.currentUser?.id);
        },

        getMonthlyExpenses() {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            return this.expenses
                .filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expense.user_id === this.currentUser?.id &&
                           expenseDate.getMonth() === currentMonth &&
                           expenseDate.getFullYear() === currentYear;
                })
                .reduce((total, expense) => total + expense.amount, 0);
        },

        getTotalExpenses() {
            return this.expenses
                .filter(expense => expense.user_id === this.currentUser?.id)
                .reduce((total, expense) => total + expense.amount, 0);
        },

        getWeeklyActivity() {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            let activities = 0;
            
            // Count diary entries
            activities += this.diaryEntries.filter(entry => 
                entry.user_id === this.currentUser?.id && 
                new Date(entry.date) >= oneWeekAgo
            ).length;
            
            // Count mood entries
            activities += this.moodEntries.filter(entry => 
                entry.user_id === this.currentUser?.id && 
                new Date(entry.date) >= oneWeekAgo
            ).length;
            
            // Count expense entries
            activities += this.expenses.filter(entry => 
                entry.user_id === this.currentUser?.id && 
                new Date(entry.date) >= oneWeekAgo
            ).length;
            
            return activities;
        },

        getRecentActivity() {
            const activities = [];
            
            // Add recent diary entries
            this.diaryEntries
                .filter(entry => entry.user_id === this.currentUser?.id)
                .slice(0, 3)
                .forEach(entry => {
                    activities.push({
                        id: `diary-${entry.id}`,
                        icon: '📔',
                        title: `Diary: ${entry.title}`,
                        date: this.formatDate(entry.date),
                        timestamp: entry.created_at ? entry.created_at.toDate().getTime() : Date.now()
                    });
                });
            
            // Add recent mood entries
            this.moodEntries
                .filter(entry => entry.user_id === this.currentUser?.id)
                .slice(0, 2)
                .forEach(entry => {
                    activities.push({
                        id: `mood-${entry.id}`,
                        icon: entry.mood_emoji,
                        title: `Mood: ${entry.mood_rating}/10`,
                        date: this.formatDate(entry.date),
                        timestamp: entry.created_at ? entry.created_at.toDate().getTime() : Date.now()
                    });
                });
            
            // Add recent expenses
            this.expenses
                .filter(entry => entry.user_id === this.currentUser?.id)
                .slice(0, 2)
                .forEach(entry => {
                    activities.push({
                        id: `expense-${entry.id}`,
                        icon: '💰',
                        title: `Expense: ₹${entry.amount}`,
                        date: this.formatDate(entry.date),
                        timestamp: entry.created_at ? entry.created_at.toDate().getTime() : Date.now()
                    });
                });
            
            // Sort by timestamp (most recent first) and return top 5
            return activities
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);
        },

        // Utility methods
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        }
    }))
})
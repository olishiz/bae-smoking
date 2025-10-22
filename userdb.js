// Simple Local User Database
class UserDatabase {
    constructor() {
        this.usersKey = 'plantTracker_users';
        this.currentUserKey = 'plantTracker_currentUser';
    }

    // Get all users from localStorage
    getAllUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : {};
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // Register a new user
    register(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters' };
        }

        if (password.length < 4) {
            return { success: false, message: 'Password must be at least 4 characters' };
        }

        const users = this.getAllUsers();

        if (users[username]) {
            return { success: false, message: 'Username already exists' };
        }

        // Create new user with empty plant data
        users[username] = {
            password: password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            plantData: null // Will be initialized when they start the app
        };

        this.saveUsers(users);
        return { success: true, message: 'Registration successful!' };
    }

    // Login user
    login(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        const users = this.getAllUsers();
        const user = users[username];

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Incorrect password' };
        }

        // Set current user session
        localStorage.setItem(this.currentUserKey, username);
        return { success: true, message: 'Login successful!', username: username };
    }

    // Get current logged-in user
    getCurrentUser() {
        return localStorage.getItem(this.currentUserKey);
    }

    // Logout current user
    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Get user's plant data
    getUserPlantData(username) {
        const users = this.getAllUsers();
        const user = users[username];
        return user ? user.plantData : null;
    }

    // Save user's plant data
    saveUserPlantData(username, plantData) {
        const users = this.getAllUsers();
        if (users[username]) {
            users[username].plantData = plantData;
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    // Get all usernames (for admin purposes)
    getAllUsernames() {
        const users = this.getAllUsers();
        return Object.keys(users);
    }

    // Delete user account
    deleteAccount(username) {
        const users = this.getAllUsers();
        if (users[username]) {
            delete users[username];
            this.saveUsers(users);

            // If deleting current user, logout
            if (this.getCurrentUser() === username) {
                this.logout();
            }
            return true;
        }
        return false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserDatabase;
}

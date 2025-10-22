// API-based User Database
class UserDatabase {
    constructor() {
        this.apiUrl = window.location.origin; // Use same host as frontend
        this.sessionTokenKey = 'plantTracker_sessionToken';
    }

    // Get session token from localStorage
    getSessionToken() {
        return localStorage.getItem(this.sessionTokenKey);
    }

    // Save session token to localStorage
    setSessionToken(token) {
        localStorage.setItem(this.sessionTokenKey, token);
    }

    // Remove session token
    clearSessionToken() {
        localStorage.removeItem(this.sessionTokenKey);
    }

    // Register a new user
    async register(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Login user
    async login(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success && data.sessionToken) {
                this.setSessionToken(data.sessionToken);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Logout current user
    async logout() {
        const sessionToken = this.getSessionToken();

        if (sessionToken) {
            try {
                await fetch(`${this.apiUrl}/api/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sessionToken })
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        this.clearSessionToken();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getSessionToken() !== null;
    }

    // Get current logged-in user
    async getCurrentUser() {
        const sessionToken = this.getSessionToken();

        if (!sessionToken) {
            return null;
        }

        try {
            const response = await fetch(`${this.apiUrl}/api/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionToken })
            });

            const data = await response.json();

            if (data.success) {
                return data.username;
            } else {
                // Invalid session, clear token
                this.clearSessionToken();
                return null;
            }
        } catch (error) {
            console.error('Session check error:', error);
            return null;
        }
    }

    // Get user's plant data
    async getUserPlantData() {
        const sessionToken = this.getSessionToken();

        if (!sessionToken) {
            return null;
        }

        try {
            const response = await fetch(`${this.apiUrl}/api/plant-data/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionToken })
            });

            const data = await response.json();

            if (data.success) {
                return data.plantData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Get plant data error:', error);
            return null;
        }
    }

    // Save user's plant data
    async saveUserPlantData(username, plantData) {
        const sessionToken = this.getSessionToken();

        if (!sessionToken) {
            return false;
        }

        try {
            const response = await fetch(`${this.apiUrl}/api/plant-data/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionToken, plantData })
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Save plant data error:', error);
            return false;
        }
    }

    // Get all usernames (for display on login page)
    async getAllUsernames() {
        try {
            const response = await fetch(`${this.apiUrl}/api/users`);
            const data = await response.json();

            if (data.success) {
                return data.usernames;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Get users error:', error);
            return [];
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserDatabase;
}

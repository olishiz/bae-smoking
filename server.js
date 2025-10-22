const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database file path
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Initialize database file if it doesn't exist
async function initDatabase() {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it
        const initialData = {
            users: {},
            sessions: {}
        };
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('Database initialized');
    }
}

// Read database
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { users: {}, sessions: {} };
    }
}

// Write database
async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Generate simple session token
function generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// API Routes

// Register new user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters'
        });
    }

    if (password.length < 4) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 4 characters'
        });
    }

    const db = await readDatabase();

    if (db.users[username]) {
        return res.status(400).json({
            success: false,
            message: 'Username already exists'
        });
    }

    // Create new user
    db.users[username] = {
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        plantData: null
    };

    const saved = await writeDatabase(db);

    if (saved) {
        res.json({
            success: true,
            message: 'Registration successful!'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error saving user data'
        });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    const db = await readDatabase();
    const user = db.users[username];

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Incorrect password'
        });
    }

    // Create session token
    const sessionToken = generateSessionToken();
    db.sessions[sessionToken] = {
        username: username,
        createdAt: new Date().toISOString()
    };

    await writeDatabase(db);

    res.json({
        success: true,
        message: 'Login successful!',
        sessionToken: sessionToken,
        username: username
    });
});

// Logout user
app.post('/api/logout', async (req, res) => {
    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(400).json({
            success: false,
            message: 'Session token required'
        });
    }

    const db = await readDatabase();
    delete db.sessions[sessionToken];
    await writeDatabase(db);

    res.json({
        success: true,
        message: 'Logout successful'
    });
});

// Get current user from session
app.post('/api/session', async (req, res) => {
    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    const db = await readDatabase();
    const session = db.sessions[sessionToken];

    if (!session) {
        return res.status(401).json({
            success: false,
            message: 'Invalid session'
        });
    }

    res.json({
        success: true,
        username: session.username
    });
});

// Get user's plant data
app.post('/api/plant-data/get', async (req, res) => {
    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    const db = await readDatabase();
    const session = db.sessions[sessionToken];

    if (!session) {
        return res.status(401).json({
            success: false,
            message: 'Invalid session'
        });
    }

    const username = session.username;
    const user = db.users[username];

    res.json({
        success: true,
        plantData: user.plantData
    });
});

// Save user's plant data
app.post('/api/plant-data/save', async (req, res) => {
    const { sessionToken, plantData } = req.body;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    const db = await readDatabase();
    const session = db.sessions[sessionToken];

    if (!session) {
        return res.status(401).json({
            success: false,
            message: 'Invalid session'
        });
    }

    const username = session.username;

    if (db.users[username]) {
        db.users[username].plantData = plantData;
        const saved = await writeDatabase(db);

        if (saved) {
            res.json({
                success: true,
                message: 'Plant data saved'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving plant data'
            });
        }
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

// Get all usernames (for display on login page)
app.get('/api/users', async (req, res) => {
    const db = await readDatabase();
    const usernames = Object.keys(db.users);
    res.json({
        success: true,
        usernames: usernames
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
async function startServer() {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`
╔════════════════════════════════════════════╗
║   🌱 Plant Tracker Server Running!        ║
║                                            ║
║   Local:    http://localhost:${PORT}        ║
║   Network:  http://0.0.0.0:${PORT}          ║
║                                            ║
║   Database: ${DB_FILE}
║                                            ║
║   Ready to accept connections! 🚀          ║
╚════════════════════════════════════════════╝
        `);
    });
}

startServer();

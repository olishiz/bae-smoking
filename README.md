# 🌱 Bae Plant Growth Tracker

A fun, gamified daily habit tracker where you nurture a virtual marijuana plant from seed to full maturity! Built with **NestJS, TypeScript, and Node.js**!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project (First Time)
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run start:dev
```

The server will start on http://localhost:3000

### 3. Open the App
Open your browser and go to:
- **http://localhost:3000/login.html**

### 4. Create Account & Start Growing!
- Register a new account
- Login with your credentials
- Start growing your plant!

## 🔐 User Accounts & Real Database

The app uses a **professional NestJS backend with TypeScript and file-based database**!

### Why This Matters
- **Works across devices**: Register on your phone, login on your friend's phone - same account!
- **Persistent data**: All user data is stored in `database.json` on the server
- **Multi-user support**: Each user has completely separate plant data
- **Real authentication**: Session-based login system with tokens
- **Type-safe**: Full TypeScript support with strict typing
- **Scalable architecture**: Built with NestJS modules, services, and controllers

### Features
- **Register**: Create a new account with username (min 3 characters) and password (min 4 characters)
- **Login**: Access your personal plant tracker from any device connected to the server
- **Logout**: Safely logout from your account
- **Multiple Users**: Each user has completely separate plant data and progress
- **Cross-device sync**: Login from different devices and your data is always there!

## 🎮 How It Works

Your virtual plant grows as you check in daily and take care of it. The more consistent you are, the faster your plant grows!

### Growth Stages

Your plant goes through 7 stages of growth:

1. **🌰 Seed** (Day 0-2) - Just starting out
2. **🌱 Sprout** (Day 3-6) - First signs of life
3. **🌿 Seedling** (Day 7-13) - Getting stronger
4. **🪴 Growing** (Day 14-20) - Rapid growth phase
5. **🌲 Budding** (Day 21-27) - Developing buds
6. **🌳 Flowering** (Day 28-34) - Beautiful flowers appear
7. **🎄 Mature** (Day 35+) - Fully grown plant!

## 🎯 Daily Actions

### ✅ Daily Check-in
- **Must do once per day** to advance to the next day
- Builds your streak counter
- Missing a day breaks your streak
- Your plant only grows when you check in!

### 💧 Water Plant
- Can be done once per day
- Keeps your plant healthy and hydrated
- Improves your overall health rating

### ✨ Give Love
- Can be done once per day
- Show your plant some care and affection
- Boosts plant happiness and health

## 📊 Stats Tracking

- **Day Counter**: Shows how many days you've been growing your plant
- **Growth Stage**: Current stage of your plant's development
- **Health**: Star rating based on how well you care for your plant (⭐ to 🌟🌟🌟)
- **Streak**: Consecutive days you've checked in

## 💡 Tips for Success

1. **Check in daily** - This is the most important action!
2. **Water regularly** - Your plant needs hydration
3. **Show love** - A little care goes a long way
4. **Build your streak** - Consistency is key
5. **Don't miss days** - Missing more than 1 day breaks your streak

## 💾 Data Storage

- **Real database file**: All data stored in `database.json` on the server
- **Cross-device support**: Access your account from any device connected to the server
- **Multi-user support**: Each user has their own separate data
- **Persistent storage**: Data survives server restarts
- **Session management**: Secure session tokens for authentication
- **Automatic sync**: Changes are saved to the server in real-time
- Use the "Reset Progress" button to reset your plant (keeps your account)
- Logout anytime and login again from any device to continue where you left off

### Database Structure
The `database.json` file contains:
- All user accounts (username + password)
- Each user's plant data (growth stage, stats, history)
- Active session tokens

## 🎨 Features

- **Multi-user support** - Each user has their own account and plant data
- **User authentication** - Register, login, and logout functionality
- **Beautiful animations** - Watch your plant sway in the wind
- **Progress tracking** - See exactly how far you are to the next stage
- **History log** - Review your journey with your plant
- **Responsive design** - Works on mobile and desktop
- **Automatic save** - Never lose your progress
- **Server-side database** - All data stored securely on the server

## 🏆 Achievement

Reach Day 35 to grow a fully mature plant! Can you maintain your streak all the way to the end?

## 🔧 Technical Details

### Backend Architecture
- **NestJS 10** - Progressive Node.js framework with TypeScript
- **TypeScript** - Strict type safety and modern JavaScript features
- **Modular Architecture** - Organized into modules (Auth, Plant, Database)
- **Dependency Injection** - Built-in IoC container
- **Decorators** - Clean, declarative code style
- **File-based JSON database** - Simple and portable
- **Class Validator** - Request validation with DTOs
- **CORS enabled** - Cross-origin resource sharing
- **RESTful API** - Clean, well-structured API endpoints

### Project Structure
```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
├── plant/                     # Plant data module
│   ├── plant.module.ts
│   ├── plant.controller.ts
│   └── plant.service.ts
├── database/                  # Database service
│   └── database.service.ts
└── common/                    # Shared DTOs
    └── dto/
        ├── auth.dto.ts
        └── plant.dto.ts
```

### Frontend
- **Pure HTML5** - No build tools required
- **CSS3** - Beautiful animations
- **Vanilla JavaScript** - No frameworks, async/await for API calls
- **Fetch API** - Modern HTTP requests

### API Endpoints
- `POST /api/register` - Create new user account
- `POST /api/login` - Login and get session token
- `POST /api/logout` - Logout and invalidate session
- `POST /api/session` - Verify session token
- `POST /api/plant-data/get` - Get user's plant data
- `POST /api/plant-data/save` - Save user's plant data
- `GET /api/users` - List all usernames
- `GET /api/health` - Server health check

## 📱 Browser Compatibility

Works on all modern browsers that support:
- LocalStorage
- CSS Grid
- CSS Animations
- ES6 JavaScript

---

**Happy Growing! 🌱**

Remember: Just like a real plant, your virtual plant needs daily attention and care to thrive!

Audio Streaming Platform API
This project is a robust Backend API built on Node.js, Express.js, and MongoDB (Mongoose). It is designed to power an audio streaming platform, with a strong focus on security, Role-Based Access Control (RBAC), and efficient content streaming.
🚀 Key Features
Full Authentication (JWT): Includes secure routes for user login, registration, email verification, and automatic token refresh using Refresh Tokens.
File Uploads (Multer): Supports the upload and storage of audio files, album covers, and user profile pictures.
Audio Streaming: Supports partial playback of audio files by correctly handling HTTP Range headers, ensuring instant and bandwidth-efficient streaming.
Role-Based Access Control (RBAC): Dedicated private routes for administrators (Admins) to manage all system content and users.
Uniform Error Handling: A comprehensive, centralized system for validation, custom error mapping, and global error handling.
🛠️ Project Structure
The project follows the standard MVC (Model-View-Controller) architecture to ensure separation of concerns and high maintainability:
├───config/               # Database configurations
├───controllers/          # Business Logic (Core application functions)
│   ├───audio.Controller.js   # Audio file operations (upload, stream, delete)
│   ├───auth.Controller.js    # Authentication logic (login, register, password reset)
│   └───userController.js     # User profile management
├───middleware/           # Middleware functions (Authentication, Authorization, Validation, Error Handling)
├───models/               # Mongoose schemas (e.g., User, Audio)
├───routes/               # API route definitions (Endpoints)
├───uploads/              # Storage directory for user files (Ignored by Git)
└───utils/                # Utility functions (email sending, token generation)


⚙️ Getting Started
1. Prerequisites
Node.js (Version 18 or higher recommended)
MongoDB (Local instance or cloud service like Atlas)
2. Installation
# Clone the repository
git clone <repository_link>
cd <project_name>

# Install necessary packages
npm install


3. Environment Variables Setup
Create a file named .env in the root directory and fill it with the necessary variables:
# Database Configuration
MONGO_URI=mongodb://localhost:27017/my_audio_app
PORT=3000

# JWT Keys (Use strong, random strings)
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
VERIFY_TOKEN_SECRET=<your_email_verification_secret>

# Email Settings (for sending verification and password reset emails)
# Use your Gmail account credentials or another SMTP provider
MY_EMAIL=<your_sending_email_address>
MY_PASSWORD=<your_app_password_or_regular_password>


4. Running the Server
npm start


The server will start running on port 3000 (or the port specified in your .env file).
🔗 Core API Endpoints
Category
Route
Description
Access
Authentication
POST /api/auth/register
Register a new user
Public


POST /api/auth/login
Log in and set HTTP-only cookies
Public


GET /api/auth/verify/:token
Verify user's email address
Public


POST /api/auth/logout
Log out and clear cookies
Public


POST /api/auth/forgot-password
Request password reset email
Public
User Profiles
GET /api/users/profile
Get current user's profile data
Private (Authenticated)


PUT /api/users/profile
Update user profile (name, profile picture)
Private (Authenticated)
Audio Files
POST /api/audios/upload
Upload a new audio file and cover
Private (Authenticated)


GET /api/audios/myAudios
Get a list of the authenticated user's audio files
Private (Authenticated)


GET /api/audios/:id
Get metadata for a specific audio file
Private (Authenticated)


GET /api/audios/stream/:id
Stream an audio file (supports Range Header)
Private (Authenticated)
Admin Management
GET /api/audios/admin/all
Get all audio files in the entire system
Private (Admin Only)


DELETE /api/audios/admin/:id
Delete a specific audio file from the system and disk
Private (Admin Only)



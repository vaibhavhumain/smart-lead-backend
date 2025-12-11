The backend is built using Node.js, Express, MongoDB (Mongoose), and Cron Jobs to manage lead data, batch API syncing, authentication, and background tasks.

 Key Features

RESTful API for managing leads

User authentication (JWT-based)

Batch API requests to external CRM

Duplicate-free background syncing

Cron job for periodic auto-sync

Centralized error handling

Optimized database queries

 Backend Setup Instructions

Clone the repo:

git clone https://github.com/vaibhavhumain/smart-lead-backend


Install backend dependencies:

cd backend
npm install


Create an .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CRM_API_KEY=your_api_key


Start the server:

npm start

 Backend Architecture
1. API Layer (routes + controllers)

Handles:

CRUD operations for leads

User login/signup

Triggering manual sync

Separated into:

/routes
/services
/models

 Batch API Handling Strategy

The system syncs leads to the external CRM in batches to avoid large payloads and API overload.

How it works:

Fetch unsynced leads (synced: false)

Split them into batches of 50 records

Send each batch sequentially to CRM

Update sync status in database

This ensures:

No timeout issues

Clean, controlled API usage

High reliability

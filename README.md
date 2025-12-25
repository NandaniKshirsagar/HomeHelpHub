# 🛠️ HomeHelpHub

HomeHelpHub is a two-sided platform that connects users with verified local service professionals like plumbers, electricians, and carpenters, enabling secure authentication, service discovery, and real-time booking management in one place.

# 🚨Problem Statement

In most local communities, people struggle to quickly find reliable service professionals within their own area, especially when they are new to a city or unfamiliar with local contacts. At the same time, many skilled local service providers—such as plumbers, electricians, carpenters, and technicians—depend only on word-of-mouth and lack a digital platform to showcase their services, resulting in missed job opportunities. This disconnect creates delays, trust issues, and an unorganized service discovery process that affects both users seeking help and local providers looking for consistent work.


# 💡Solution

HomeHelpHub bridges this gap by providing a centralized, location-based digital platform that directly connects users with verified local service professionals. The platform enables easy service discovery, secure authentication, profile verification, and real-time booking management. By building trust through verification and real-time updates, HomeHelpHub ensures that users can quickly find reliable help in their locality while empowering local service providers—especially new or independent workers—to gain visibility, receive genuine service requests, and grow their livelihood through a structured digital ecosystem.


# ✨ Key Features

🔐 Login & Signup using Google Authentication

👥 Two-Sided Platform – Separate interfaces for Clients and Service Providers

🧑‍🔧 Service Provider Profiles with document verification

📍 Location-Based Service Discovery

📅 Booking & Request Management System

🔄 Real-Time Updates using Firebase Realtime Database

📂 Verification Document Upload for trusted services

🔔 Request Notifications & Status Tracking

🛡️ Role-Based Access Control for secure navigation



# 🧱 Tech Stack

 ## 🔹 Frontend

- React.js – Interactive and responsive UI

- CSS – Styling and layout

- Vite – Fast development build tool



 ## 🔹 Backend

- Node.js – Server-side runtime

- Express.js – REST API and routing

- Firebase Admin SDK – Secure backend operations

 ## 🔹 Database & Authentication

- Firebase Authentication – User login & Google Sign-In

- Firebase Realtime Database – Real-time data sync

- LocalStorage – Temporary session data

 ## 🔹 Google Technologies Used

-  Google Sign-In

- Firebase Authentication

- Firebase Realtime Database

- Firebase Admin SDK

# 🚀 How to Run Locally
## 🔧 Prerequisites

- Node.js & npm

- Firebase Project (Authentication + Realtime DB enabled)

- Google Cloud Console setup

# 🖥️ Clone the Repository

- git clone https://github.com/NandaniKshirsagar/HomeHelpHub.git

- cd HomeHelpHub

# 📦 Backend Setup

### 1. Navigate to the backend folder:

- cd finalclientproject/server


### 2. Install dependencies:

- npm install


### 3. Create a .env file with the following variables:

***🔐 Firebase Admin Configuration***

PORT=5001

FIREBASE_PROJECT_ID=your_firebase_project_id

FIREBASE_CLIENT_EMAIL=your_firebase_client_email

FIREBASE_PRIVATE_KEY=your_firebase_private_key

***🔑 Google Authentication Configuration***

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret


Firebase credentials must be generated from Google Cloud Console


### 4. Start the backend server:

  - npm start

# 🌐 Frontend (Client) Setup

  - cd ../client

  - npm install

  - npm run dev

# 🌐 Frontend (Service Provider) Setup

  - cd finalsp/client

  - npm install

- npm run dev

# 🖥️ Deployment (Local)

 -  Client App → http://localhost:5173

 -  Service Provider App → http://localhost:5174

 -  Backend Server → http://localhost:5001

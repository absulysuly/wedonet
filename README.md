# Wedonet Freelancing Platform

Wedonet is a sophisticated, modern freelancing platform designed to connect clients with talented freelancers in Iraq and the Kurdistan Region. It features a clean, responsive UI, multilingual support, and is enhanced with AI-powered service matching and legal assistance tools.

## ✨ Features

-   **🌐 Multilingual Support**: Full internationalization for English, Arabic, and Sorani Kurdish, including complete Right-to-Left (RTL) layout support.
-   **🤖 AI-Powered Tools**:
    -   **AI Service Matching**: Utilizes the Google Gemini API to analyze project descriptions and recommend suitable service categories.
    -   **AI Legal Assistant**: Tools for analyzing legal documents and generating standard agreements.
    -   **AI Legal Playbooks**: Step-by-step legal guides for common business scenarios.
-   **🤝 Project & Proposal System**: A complete workflow for clients to post projects and for freelancers to submit proposals.
-   **💼 Dashboards & Management**:
    -   Role-Based Dashboards for clients, freelancers, and admins.
    -   Client Project Management to track status and communicate.
    -   Admin User Management panel.
-   **💬 Real-time Messaging**: A dynamic chat system with an inbox, supporting text and image uploads.
-   **📱 Progressive Web App (PWA)**: Installable on mobile and desktop for a native-like experience with offline caching capabilities.
-   **🔐 Social Authentication**: Streamlined and secure login/registration flow using Google and Facebook.
-   **🔍 Advanced Search & Filtering**: A comprehensive system to find freelancers based on location, category, rating, and experience.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript (with a no-build setup using ES Modules and Import Maps)
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Backend**: Mock API service (`services/api.ts`) simulating a full backend for rapid development.

---

## 🚀 Getting Started

This project is configured to run directly in the browser without a build step, making the setup process straightforward.

### Prerequisites

You need a simple local HTTP server. Opening the `index.html` file directly from your filesystem (`file://...`) will not work due to browser security policies.

-   **VS Code Live Server Extension**: The easiest one-click solution.
-   **Node.js `serve` package**: If you have Node.js, run `npm install -g serve` to install it globally.

### 1. Environment Configuration

The application requires a Google Gemini API key to power its AI features.

1.  **Create a `.env` file**: In the project's root directory, create a new file named `.env`.
2.  **Add your API Key**: Copy the contents from the included `.env.example` file and paste your Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/).
    ```env
    # .env
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

### 2. Running the App Locally

1.  **Clone the repository** and navigate to the project directory.
2.  **Serve the project folder**:
    -   **Using VS Code Live Server**: Right-click on `index.html` and select "Open with Live Server".
    -   **Using `serve`**: Open your terminal in the project directory and run: `serve .`
3.  **Open in browser**: Your browser will open at the local URL provided (e.g., `http://localhost:3000`).

> **Important Note on API Keys:**
> The code is designed for a platform where `process.env.API_KEY` is securely injected into the frontend's execution environment. For local development, this project uses a workaround described in the "Troubleshooting" section to load the key from your `.env` file. **Never commit your `.env` file or expose your API key in client-side code in a public production environment.**

---

## 🚀 Deployment

This application is a static site and can be deployed to any modern static hosting provider (e.g., Netlify, Vercel, Firebase Hosting, AWS S3).

1.  **Upload Files**: Upload all files from this project directory to your hosting provider.
2.  **Set Environment Variable**: In your hosting provider's settings, you must set the `API_KEY` environment variable. This is crucial for the AI features to work. Refer to your provider's documentation on how to set environment variables for your site. The application is expecting this variable to be available as `process.env.API_KEY`.

---

## ❓ Troubleshooting

-   **AI features are not working locally:**
    -   **Problem**: The application code expects `process.env.API_KEY`, but this is not available in the browser during local development.
    -   **Solution**: To make local development easier, this project includes a small script in `index.html` that will fetch your key from the `.env` file and make it available for the application. Ensure your `.env` file is correctly formatted and in the root directory. If issues persist, clear your browser cache.

-   **Camera/Image upload is not working:**
    -   **Problem**: The browser needs permission to access your camera.
    -   **Solution**: When prompted, click "Allow". If you previously denied it, you must go into your browser's site settings for `localhost` and reset the camera permission.

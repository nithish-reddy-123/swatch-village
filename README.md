# Swatch Village

Swatch Village is a comprehensive web application designed to empower villagers and administrators in managing local issues effectively. It features a robust problem reporting system, an admin dashboard for issue tracking, and an integrated AI chatbot for instant assistance.

## 🚀 Features

-   **User Registration & Authentication**: Secure login and registration for citizens and administrators.
-   **Issue Reporting**: Citizens can report local problems (e.g., water, electricity, roads) with descriptions and photos.
-   **Admin Dashboard**: Administrators can view, track, and update the status of reported issues.
-   **AI Chatbot**: An intelligent assistant powered by Google Gemini API to answer user queries instantly.
-   **Responsive Design**: A modern, user-friendly interface accessible on various devices.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, React Router, Axios
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **AI Integration**: Google Gemini API
-   **Styling**: CSS Modules / Vanilla CSS

## 📦 Installation

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (Local or Atlas)
-   Google Gemini API Key

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 💡 Usage

1.  **Register**: Create a new account as a user or admin.
2.  **Report Issues**: Log in as a user to report problems in your ward.
3.  **Manage Issues**: Log in as an admin to view and resolve reported problems.
4.  **Get Help**: Click the chat icon in the bottom right to ask the AI assistant for help.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

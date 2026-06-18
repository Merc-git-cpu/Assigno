# Assigno - Modern Assignment Management

Assigno is a modern assignment reminder app designed for college students to track deadlines and stay productive.

## Getting Started Locally

If you've exported this project from Firebase Studio, follow these steps to run it on your machine:

1.  **Extract the ZIP**: Unzip the exported project files into a folder.
2.  **Install Dependencies**: Open your terminal in the project directory and run:
    ```bash
    npm install
    ```
3.  **Environment Variables**: Create a `.env.local` file in the root directory. You'll need to add your Firebase configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **View the App**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With

- **Next.js 15** (App Router)
- **Firebase** (Authentication & Firestore)
- **Genkit** (AI Agent Integration)
- **Tailwind CSS** & **ShadCN UI**
- **Lucide React** (Icons)
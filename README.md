
# Vignan Pro-Quiz Portal

A high-end, proctored quiz application built with React, Vite, Tailwind CSS, Anime.js, and Google Gemini API.

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### 2. Setup
1. Open this folder in **VS Code**.
2. Open the terminal (`Ctrl + ~`).
3. Run the following command to install dependencies:
   ```bash
   npm install
   ```

### 3. Development
Run the development server:
```bash
npm run dev
```
The application will automatically open in your browser at `http://localhost:3000`.

### 4. Admin Access
- **ID**: `Admin001`
- **Security Key**: `Vignan_admin_001`

### 5. Features
- **AI Question Generation**: Enter a topic and let Gemini 3 Flash generate questions. (Requires `process.env.API_KEY`)
- **Proctoring**: Detects tab switches and monitors camera feed.
- **Reporting**: Export student performance to Excel directly from the dashboard.
- **Anime.js Animations**: Smooth, cinematic UI transitions.

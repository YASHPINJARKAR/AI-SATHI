# 🤖 Ai Sathi — Smart City AI Assistant for Amravati

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-12.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Google%20Gemini%20AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Spline-3D%20Scenes-FF6D00?style=for-the-badge" />
</p>

> **Ai Sathi** is a real-time, AI-powered Smart City Assistant platform built specifically for the city of **Amravati, Maharashtra**. It helps citizens find public services, local businesses, government schemes, upcoming events, and much more — all through natural language chat in **Marathi, Hindi, and English**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [AI Integration](#-ai-integration)
- [Authentication](#-authentication)
- [Maps & Location](#-maps--location)
- [3D Robot (Spline)](#-3d-robot-spline)
- [Multilingual Support](#-multilingual-support)
- [Dark Mode](#-dark-mode)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Developer Team](#-developer-team)

---

## 🌟 Overview

**Ai Sathi** (meaning *"AI Friend"* in Marathi/Hindi) is a comprehensive smart city platform designed to bridge the gap between citizens and city services in **Amravati**. The platform uses cutting-edge **Google Gemini AI** to provide real-time conversational assistance in multiple languages, helping residents:

- Discover local businesses, hospitals, restaurants, and shops
- Stay informed about upcoming events and cultural activities
- Access government schemes, documents, and public office information
- Navigate the city using integrated maps with GPS-based nearby search
- Get voice-assisted responses in Hindi and Marathi

The platform features a stunning **3D interactive robot** built with Spline (WebGL), an animated particle background, glassmorphism UI design, and a fully responsive layout that works on all devices.

---

## ✨ Features

### 🧠 AI-Powered Chat
- Conversational AI using **Google Gemini** and **OpenRouter** APIs
- Answers questions about Amravati city, services, locations, and more
- Supports **Marathi**, **Hindi**, and **English** input and responses
- Voice input (speech-to-text) for hands-free interaction
- Text-to-speech output for AI responses
- Chat history saved per session

### 🏪 Business Directory
- Searchable and filterable directory of local businesses
- Categories: Hospitals, Restaurants, Shops, Education, and more
- Ratings, distances, and contact information for each business
- GPS-based nearby search

### 📅 Events & Activities
- Upcoming events in Amravati with date, location, and pricing
- Filter by category (Cultural, Sports, Tech, etc.)
- Calendar view of events
- Free and paid event badges

### 🏛️ Government Services
- Information about government schemes for citizens
- Required documents for various services
- Office locations with maps integration
- Quick links to relevant portals

### 📍 Location & Maps
- Interactive Leaflet.js-powered maps
- GPS-based current location detection
- Nearby business and service search on the map
- Turn-by-turn direction links

### 🌤️ Weather Widget
- Real-time weather information for Amravati
- Temperature, humidity, wind speed, and weather description
- Dynamic icons based on current conditions

### 👤 User Profiles & Authentication
- Google Sign-In via Firebase Authentication
- Personalized profile page
- Admin role with restricted access to admin-only views
- Feedback form stored in local storage

### 🎨 Premium UI/UX
- **Glassmorphism** design language with frosted glass cards
- **Dark Mode** / Light Mode toggle
- **Particle Background** — interactive animated particle system
- **3D Spline Robot** on Landing Page and Dashboard hero section
- Smooth page transitions and micro-animations
- Fully responsive — works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **AI / LLM** | Google Gemini AI (`@google/generative-ai`) |
| **AI Fallback** | OpenRouter SDK (`@openrouter/sdk`) |
| **Authentication** | Firebase Auth v12 (Google Sign-In) |
| **3D Scenes** | Spline (`@splinetool/react-spline`, `@splinetool/runtime`) |
| **Maps** | Leaflet.js + React Leaflet |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS (CSS Variables, Glassmorphism, Animations) |
| **State Management** | React Context API |
| **Linting** | ESLint 9 |

---

## 📁 Project Structure

```
Ai Sathi/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images and static files
│   ├── components/             # Reusable UI components
│   │   ├── AmravatiInfoTree    # Collapsible info tree about Amravati
│   │   ├── BottomNav           # Mobile bottom navigation bar
│   │   ├── DeveloperModal      # Developer team modal popup
│   │   ├── FloatingChatButton  # Floating quick-access chat button
│   │   ├── LoginModal          # Google sign-in modal
│   │   ├── ParticleBackground  # Animated particle canvas background
│   │   ├── Sidebar             # Collapsible desktop sidebar navigation
│   │   ├── SplineScene         # 3D Spline scene loader with skeleton + fallbacks
│   │   ├── TopRightProfile     # Top-right user profile / login button
│   │   └── WeatherWidget       # Live weather widget for Amravati
│   ├── context/
│   │   └── AuthContext.jsx     # Firebase Auth context provider
│   ├── data/
│   │   └── mockData.js         # Mock data for businesses and events
│   ├── pages/
│   │   ├── LandingPage         # Hero landing page with 3D robot
│   │   ├── Dashboard           # Main city dashboard
│   │   ├── Chat                # AI chat interface
│   │   ├── Directory           # Business directory
│   │   ├── Events              # Events listing
│   │   ├── Services            # Government services
│   │   ├── MapPage             # Interactive maps
│   │   └── ProfilePage         # User profile & admin panel
│   ├── App.jsx                 # Root app with routing logic
│   ├── App.css                 # Global app layout styles
│   ├── index.css               # Design system: CSS variables, tokens, utilities
│   ├── LanguageContext.jsx     # Multilingual (Marathi/Hindi/English) context
│   ├── firebase.js             # Firebase app initialization
│   └── main.jsx                # React DOM entry point
├── .env                        # Environment variables (API keys)
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── package.json                # Dependencies and scripts
```

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section with 3D robot, tagline, and CTA buttons |
| `/dashboard` | Dashboard | City overview with stats, features grid, weather, events |
| `/chat` | Chat | Full-screen AI chat with voice input/output |
| `/directory` | Directory | Business directory with search and filters |
| `/events` | Events | Upcoming events in Amravati |
| `/services` | Services | Government schemes and public services |
| `/map` | Map | Interactive Leaflet map with nearby search |
| `/profile` | Profile | User profile, settings, and admin panel |

> **Admin users** are automatically redirected to `/profile` and have access to the feedback dashboard and user management.

---

## 🧩 Components

### `SplineScene`
Lazy-loaded 3D Spline scene component with:
- Skeleton loading animation (pulsing orb with spinning rings)
- Error boundary with fallback UI
- Mobile fallback (no WebGL rendering on small screens)
- Transparent background support via `setBackgroundColor('transparent')`
- Automatic Spline watermark removal via MutationObserver

### `ParticleBackground`
Canvas-based animated particle system that:
- Renders floating, connected particles
- Adapts color scheme to dark/light mode
- Responds to mouse proximity (interactive particles)

### `WeatherWidget`
- Fetches live weather data for Amravati
- Displays temperature, humidity, wind speed, UV index, and feels-like temperature
- Animated weather condition icons and gradient cards

### `Sidebar`
- Collapsible desktop navigation sidebar
- Active route highlighting
- Dark/Light mode toggle built-in
- Language switcher integrated

### `LoginModal`
- Firebase Google Sign-In flow
- Modal overlay with glassmorphism design
- Persists auth state across sessions

### `AmravatiInfoTree`
- Collapsible information tree about Amravati city
- Sections: History, Geography, Economy, Education, Culture

---

## 🤖 AI Integration

Ai Sathi uses **Google Gemini AI** as its primary AI model for the chat interface.

### How it works
1. User sends a message (text or voice)
2. The app constructs a prompt with city context (Amravati knowledge base)
3. Gemini API returns a natural language response
4. Response is displayed and optionally read aloud via text-to-speech
5. OpenRouter SDK is available as a fallback AI provider

### AI Capabilities
- Answers questions about Amravati city geography, history, culture
- Provides directions to local businesses and landmarks
- Explains government schemes in simple language
- Responds fluently in Marathi, Hindi, and English
- Understands mixed-language (Hinglish/Marathish) queries

---

## 🔐 Authentication

Authentication is powered by **Firebase Authentication** with Google Sign-In:

- **Firebase Project**: `ai-sathi-98736`
- **Auth Domain**: `ai-sathi-98736.firebaseapp.com`
- **Provider**: Google OAuth 2.0
- **Roles**:
  - `user` — Standard citizen user
  - `admin` — Access to admin panel, feedback data, and user insights

Auth state is managed globally via `AuthContext` and persists across page refreshes.

---

## 🗺️ Maps & Location

Maps are powered by **Leaflet.js** with **React Leaflet** bindings:

- Interactive, zoomable city map centered on Amravati
- Current GPS location detection via browser Geolocation API
- Nearby business markers with popups
- Clickable map pins with business/service details
- Direction links to Google Maps

---

## 🎮 3D Robot (Spline)

The interactive 3D robot displayed on the Landing Page and Dashboard hero section is built using **Spline** (a browser-based 3D design tool):

| Location | Scene URL |
|---|---|
| Landing Page | `https://prod.spline.design/31VIZdegQnugXSDa/scene.splinecode` |
| Dashboard Hero | `https://prod.spline.design/31VIZdegQnugXSDa/scene.splinecode` |

The `SplineScene` component handles:
- Lazy loading (downloaded only when needed)
- Transparent background (no black box)
- Overflow visible (no corner clipping)
- Programmatic background removal via `splineApp.setBackgroundColor('transparent')`

---

## 🌐 Multilingual Support

Ai Sathi supports three languages, switchable at any time via the language selector:

| Language | Code | Script |
|---|---|---|
| English | `en` | Latin |
| Hindi | `hi` | Devanagari (हिन्दी) |
| Marathi | `mr` | Devanagari (मराठी) |

Language state is managed via `LanguageContext` and persists across all pages. All UI labels, headings, descriptions, and AI responses adapt to the selected language.

---

## 🌙 Dark Mode

The app supports a global **Dark Mode / Light Mode** toggle:

- Toggled via the Moon/Sun icon button in the navigation
- Applied via a `data-theme="dark"` attribute on `<html>`
- All CSS variables switch automatically using `:root` and `[data-theme="dark"]` selectors
- Particle background, cards, sidebar, and all components adapt seamlessly

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/sanketthakare-26/Ai-Sathi.git

# Navigate into the project folder
cd Ai-Sathi

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Gemini AI API Key
VITE_GEMINI_API_KEY=AIzaSyBpHmcD0P__KIONd_-sjr9eQ8mMDG0bYW0


```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

Firebase configuration is already initialized in `src/firebase.js`. For production, consider moving Firebase config to environment variables as well.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev Server | `npm run dev` | Start local development server with HMR |
| Build | `npm run build` | Build optimized production bundle to `dist/` |
| Preview | `npm run preview` | Preview the production build locally |
| Lint | `npm run lint` | Run ESLint across the entire codebase |

---

## 📦 Deployment

The production build is generated in the `dist/` folder:

```bash
npm run build
```

You can deploy the `dist/` folder to any static hosting provider:

- **Firebase Hosting** (recommended — integrates with Firebase Auth)
- **Vercel** — zero-config deployment
- **Netlify** — drag-and-drop or Git-based deploy
- **GitHub Pages** — free static hosting

### Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 👨‍💻 Developer Team

Built with ❤️ by the **Ai Sathi Development Team** for the Smart City initiative of Amravati, Maharashtra.
Sanket Thakare
Bhakti Kaner
Yash Pinjarkar
Trisha Bobade

---

## 📄 License

This project is private and built for academic/city initiative purposes.  
© 2025 Ai Sathi — Smart City Assistant for Amravati.

---

<p align="center">
  Made with ❤️ for the citizens of <strong>Amravati, Maharashtra</strong> 🇮🇳
</p>

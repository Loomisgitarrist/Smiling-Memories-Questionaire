# Overview

This project is a Progressive Web Application (PWA) for an AI Avatar Questionnaire service. It serves as a client-side frontend that collects user information to create personalized AI assistants through questionnaires. The application includes a landing page showcasing AI applications and a detailed questionnaire form that integrates with a backend API for data storage and processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a simple static web architecture with vanilla JavaScript:
- **Static HTML Pages**: Two main pages - index.html (landing page) and Questionnaire.html (form page)
- **CSS Framework**: Custom styling with Poppins font and Font Awesome icons for a modern UI
- **Progressive Web App**: Full PWA implementation with manifest.json and service worker for offline functionality
- **Responsive Design**: Mobile-first approach with viewport meta tags and responsive layouts

## Client-Side Functionality
- **Form Handling**: JavaScript-based form submission with validation
- **PWA Features**: Service worker caching for offline access and app-like experience
- **API Integration**: Frontend communicates with external backend server at `https://chatgpt-main-server-lg.replit.app`

## Data Flow
- Users fill out questionnaire forms collecting personal and AI preference data
- Form data includes contact information, OpenAI API keys, and AI customization preferences
- Data is submitted via JavaScript to the backend API for processing and storage
- The system supports creating personalized AI assistants based on user responses

## User Experience Design
- **Landing Page**: Hero section showcasing AI applications with call-to-action buttons
- **Multi-Step Form**: Questionnaire with grouped form sections for better UX
- **Interactive Elements**: Clickable helpers for API key assistance and multi-select options
- **Visual Feedback**: Modern card-based layout with icons and badges

# External Dependencies

## Third-Party Services
- **Backend API**: Communicates with `https://chatgpt-main-server-lg.replit.app` for data persistence
- **Airtable Integration**: Backend uses Airtable as database for questionnaire responses
- **OpenAI Integration**: Collects user OpenAI API keys for AI assistant creation
- **SMS Notifications**: Backend includes SMS functionality for user communications

## External Libraries
- **Google Fonts**: Poppins font family for typography
- **Font Awesome**: Icon library (v6.0.0-beta3) for UI icons
- **Service Worker**: Browser-native PWA functionality for caching and offline support

## Browser APIs
- **Service Worker API**: For PWA functionality and offline caching
- **Fetch API**: For HTTP requests to backend services
- **Local Storage**: Potential for client-side data persistence
- **Notification API**: For PWA notifications (configured in manifest)

## Infrastructure Dependencies
- **Static Hosting**: Requires web server for serving static files
- **HTTPS**: Required for PWA functionality and service workers
- **Backend Server**: Depends on Express.js backend with CORS configuration
- **Database**: Backend uses Airtable for data storage with API integration
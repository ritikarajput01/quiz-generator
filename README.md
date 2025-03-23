
# QuizCrafter AI 🧠

QuizCrafter AI is an intelligent quiz generation application that uses AI to create custom quizzes on any topic. Perfect for educators, students, or anyone looking to test their knowledge in a fun and engaging way.

## Features

- **AI-Powered Quiz Generation**: Generate quizzes on any topic with customizable difficulty levels
- **Multiple Choice Format**: All quizzes are presented in a clear multiple-choice format
- **User Authentication**: Sign in with Google or GitHub to save your quiz history
- **Dark/Light Mode**: Choose your preferred viewing experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progressive Web App (PWA)**: Install on your mobile or desktop device for offline access

## Technology Stack

This project is built with:

- **React + TypeScript**: For a robust frontend experience
- **Vite**: For lightning-fast development and builds
- **Firebase**: For authentication and data storage
- **OpenRouter AI**: For intelligent quiz generation
- **shadcn/ui + Tailwind CSS**: For beautiful, responsive UI components
- **Service Workers**: For PWA functionality and offline capabilities

## Progressive Web App Features

QuizCrafter AI is a fully-featured Progressive Web App (PWA) that provides:

- **Installable Experience**: Add to your home screen on mobile or desktop
- **Offline Support**: Basic functionality available without an internet connection
- **App-like Experience**: Full-screen mode and native-like interactions
- **Automatic Updates**: Always have the latest version
- **Cross-platform**: Works on any device with a modern browser

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- OpenRouter API key

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd quizcrafter-ai
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Visit the homepage and select a topic for your quiz
2. Choose a difficulty level
3. Generate your custom quiz
4. Answer the questions and see your results
5. Sign in to save your quiz history
6. To install as a PWA, click the "Add to Home Screen" option in your browser menu

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenRouter API for providing the AI capabilities
- Firebase for authentication and database services
- shadcn/ui for the component library

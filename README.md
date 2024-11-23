# Mood Tracker App 🎯

A sophisticated mobile application built with React Native and Expo that leverages artificial intelligence to help users track, analyze, and understand their emotional well-being. By combining intuitive mood tracking with ChatGPT-powered insights, this app provides a unique and personalized emotional wellness experience.

## Key Features 🌟

- 📱 Intuitive mood tracking interface
- 🤖 AI-powered mood analysis using ChatGPT
- 🎨 Beautiful and engaging mood selection UI
- 📊 Advanced mood pattern visualization
- 📝 Contextual note-taking with emotion tagging
- 🔔 Smart notification system
- 📈 Comprehensive analytics dashboard
- 🧠 Personalized mood insights and recommendations

## AI Integration 🤖

### ChatGPT-Powered Insights
- **Emotional Pattern Analysis**: Advanced AI algorithms analyze your mood patterns
- **Personalized Recommendations**: Get tailored suggestions based on your emotional state
- **Contextual Understanding**: AI processes your mood notes to provide deeper insights
- **Trigger Identification**: Help identify potential mood triggers through pattern recognition
- **Coping Strategies**: Receive personalized coping strategies based on your mood history

## Technical Architecture 🏗️

### Frontend
- React Native with TypeScript for type-safe development
- Expo for cross-platform compatibility
- React Navigation for seamless screen transitions
- React Native Paper for Material Design components
- Victory Native for data visualization

### Backend Integration
- OpenAI GPT API integration for mood analysis
- AsyncStorage for secure local data persistence
- Custom hooks for state management
- Context API for global state handling

## Technologies Used 💻

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- React Native Paper
- Victory Native
- OpenAI GPT API

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for testing)
- OpenAI API key for ChatGPT integration

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
```

2. Install dependencies
```bash
cd MoodTrackerExpo
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Add your OpenAI API key to .env file
```

4. Start the development server
```bash
npm start
```

5. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

## Project Architecture 🏛️

```
MoodTrackerExpo/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── hooks/         # Custom hooks
│   ├── context/       # React Context
│   ├── services/      # API services including ChatGPT integration
│   ├── utils/         # Helper functions
│   └── types/         # TypeScript type definitions
├── assets/            # Images, fonts, etc.
└── App.tsx           # Entry point
```

## Core Features in Detail 🔍

### Advanced Mood Tracking
- Multi-dimensional mood tracking (intensity, category, context)
- Rich text notes with emotion tagging
- Activity and situation correlation
- Time-based mood patterns

### AI-Powered Analytics
- Sentiment analysis of mood notes
- Emotional pattern recognition
- Personalized insights generation
- Trigger identification and analysis

### Smart Insights Dashboard
- Weekly and monthly mood summaries
- Trend analysis with AI interpretations
- Activity-mood correlation insights
- Custom report generation

### Personalization
- AI-adapted mood categories
- Smart notification timing
- Customizable themes and UI preferences
- Personalized coping strategy suggestions

## Security and Privacy 🔒

- End-to-end encryption for sensitive data
- Local data storage prioritization
- Secure API communication
- Optional data backup

## Performance Optimization ⚡

- Lazy loading of components
- Efficient state management
- Optimized API calls
- Minimal app size

## Contributing 🤝

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- OpenAI for ChatGPT API integration
- React Native and Expo communities
- All contributors who have helped shape this project

## Support 💪

For support, please open an issue in the GitHub repository or contact our support team.

---

Built with ❤️ using React Native and ChatGPT

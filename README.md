# IELTS Vocab - Vocabulary Learning PWA

A Progressive Web App (PWA) for learning IELTS vocabulary with flashcards, quizzes, and progress tracking. Built with React and designed to work offline with localStorage persistence.

## Features

- **Browse Vocabulary**: Explore 60 essential IELTS words (Band 5-8) with filtering by category, band level, and mastery status
- **Flashcard Study**: Review words with an interactive flashcard interface
- **Quiz Practice**: Test your knowledge with multiple-choice quizzes
- **Progress Tracking**: Monitor your learning progress with detailed statistics, study time, and streaks
- **Offline Support**: Full PWA capabilities - works offline after first load
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Local Storage**: All progress, stats, and quiz results saved locally in your browser
- **Real-time Statistics**: Track daily progress, weekly activity, quiz accuracy, and study sessions

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties
- **Service Worker** - PWA offline functionality
- **localStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository:
```bash
cd ielts
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:5174
```

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Installing as PWA

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon in the address bar
3. Click "Install" in the prompt

### Mobile (iOS Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Mobile (Android Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add"

## Project Structure

```
ielts/
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   └── logo-*.png          # App icons
├── src/
│   ├── components/         # React components
│   │   ├── Sidebar.jsx    # Desktop navigation
│   │   ├── TabBar.jsx     # Mobile navigation
│   │   ├── Home.jsx       # Home dashboard
│   │   ├── Browse.jsx     # Vocabulary browser
│   │   ├── Study.jsx      # Flashcard study
│   │   ├── Quiz.jsx       # Quiz practice
│   │   └── Progress.jsx   # Progress tracking
│   ├── data/
│   │   ├── ieltsVocabulary.js # 60 IELTS words database
│   │   └── vocabularyData.js  # Vocabulary management functions
│   ├── utils/
│   │   ├── storage.js     # localStorage utilities
│   │   ├── statistics.js  # Statistical calculations
│   │   └── apiHelper.js   # API integration helpers
│   ├── services/
│   │   └── vocabularyAPI.js   # External API service
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── index.html             # HTML template
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## Data Structure

Each vocabulary word contains:
- `word`: The vocabulary word
- `pronunciation`: IPA pronunciation
- `partOfSpeech`: Word type (noun, verb, etc.)
- `definition`: Word meaning
- `example`: Usage example
- `category`: Academic or General
- `bandLevel`: IELTS band level (5-6, 7-8, 9)
- `synonyms`: List of similar words
- `status`: Learning status (mastered, learning, struggling)
- `lastReviewed`: Timestamp of last review
- `reviewCount`: Number of times reviewed

## Customization

### Adding Your Own Vocabulary

Edit `/src/data/ieltsVocabulary.js` and add your words to the `ieltsVocabularyDatabase` array:

```javascript
{
  id: 13,
  word: "Your Word",
  pronunciation: "/pronunciation/",
  partOfSpeech: "noun",
  definition: "Word definition",
  example: "Example sentence",
  category: "Academic",
  bandLevel: "7-8",
  synonyms: ["synonym1", "synonym2"],
  status: "learning",
  lastReviewed: new Date().toISOString(),
  reviewCount: 0
}
```

### Changing Colors

Edit the CSS variables in `/src/index.css`:

```css
:root {
  --accent-red: #EF4444;
  --bg-primary: #FAFAFA;
  --text-primary: #0A0A0A;
  /* ... other colors */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome, Samsung Internet)

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ for IELTS learners worldwide

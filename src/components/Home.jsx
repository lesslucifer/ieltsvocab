import { useState, useEffect, useMemo, useCallback } from 'react';
import './Home.css';
import {
  getWordOfTheDay,
  getWordsLearnedThisWeek,
  calculateQuizAccuracy
} from '../utils/statistics';

const Home = ({ vocabulary, userStats, onNavigate }) => {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [stats, setStats] = useState({
    wordsThisWeek: 0,
    quizAccuracy: 0
  });

  useEffect(() => {
    if (vocabulary.length > 0) {
      // Get deterministic word of the day
      const wotd = getWordOfTheDay();
      setWordOfTheDay(wotd);

      // Get stats
      setStats({
        wordsThisWeek: getWordsLearnedThisWeek(),
        quizAccuracy: calculateQuizAccuracy('week')
      });
    }
  }, [vocabulary]);

  // Memoize expensive calculations
  const statusCounts = useMemo(() => ({
    mastered: vocabulary.filter(word => word.status === 'mastered').length,
    learning: vocabulary.filter(word => word.status === 'learning').length,
    struggling: vocabulary.filter(word => word.status === 'struggling').length
  }), [vocabulary]);

  // Memoize recent activity calculation
  const recentActivity = useMemo(() => {
    return vocabulary
      .filter(word => word.lastReviewed)
      .sort((a, b) => new Date(b.lastReviewed) - new Date(a.lastReviewed))
      .slice(0, 3)
      .map(word => {
        const reviewedDate = new Date(word.lastReviewed);
        const now = new Date();
        const diffMs = now - reviewedDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeAgo;
        if (diffDays > 1) {
          if (diffDays === 1) timeAgo = 'Yesterday';
          else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
          else timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
        } else if (diffHours > 0) {
          timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else {
          const diffMins = Math.floor(diffMs / (1000 * 60));
          timeAgo = diffMins < 1 ? 'Just now' : `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        }

        return { ...word, timeAgo };
      });
  }, [vocabulary]);

  // Memoize greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="home">
      <div className="home-header">
        <div className="header-left">
          <h1 className="greeting">{greeting}, learner</h1>
          <p className="subgreeting">Keep up your learning streak!</p>
        </div>
        <div className="streak-badge">
          <svg className="icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 7 6 7 11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11C17 6 12 2 12 2Z" fill="#EF4444"/>
            <path d="M12 16C12 16 9 18 9 20.5C9 21.8807 10.1193 23 11.5 23H12.5C13.8807 23 15 21.8807 15 20.5C15 18 12 16 12 16Z" fill="#F97316"/>
          </svg>
          <span>{userStats?.currentStreak || 0} Day Streak</span>
        </div>
      </div>

      {wordOfTheDay && (
        <div className="word-of-day card">
          <div className="wotd-header">
            <h2>Word of the Day</h2>
            <span className="wotd-date">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="wotd-content">
            <div className="word-title-row">
              <div className="word-title">
                <h3>{wordOfTheDay.word}</h3>
                <div className="word-meta">
                  <span className="pronunciation">{wordOfTheDay.pronunciation}</span>
                  <span className="part-of-speech">{wordOfTheDay.partOfSpeech || 'adjective'}</span>
                </div>
              </div>
            </div>
            <p className="definition">{wordOfTheDay.definition}</p>
            <p className="example">"{wordOfTheDay.example}"</p>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <div className="action-card" onClick={() => onNavigate && onNavigate('study')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          <div className="action-card-content">
            <h3>Start Flashcards</h3>
            <p>Review vocabulary with spaced repetition</p>
          </div>
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="action-card" onClick={() => onNavigate && onNavigate('quiz')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
          <div className="action-card-content">
            <h3>Take Quiz</h3>
            <p>Test your knowledge with timed quizzes</p>
          </div>
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="action-card" onClick={() => onNavigate && onNavigate('browse')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <div className="action-card-content">
            <h3>Browse Words</h3>
            <p>Explore the full IELTS word collection</p>
          </div>
          <svg className="arrow-icon" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list card">
          {recentActivity.map((word, index, array) => (
            <div key={word.id}>
              <div className="activity-item">
                <div className="activity-word">
                  <div className={`activity-indicator ${word.status}`}></div>
                  <div className="activity-word-info">
                    <span className="word-name">{word.word}</span>
                    <span className="word-definition">{word.definition}</span>
                  </div>
                </div>
                <span className="time-ago">{word.timeAgo}</span>
              </div>
              {index < array.length - 1 && <div className="activity-divider"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
